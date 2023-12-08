import { Application } from "express";
import { NextFunction, Request, Response } from "../http";
import { PopulateStrategy, RouteErrorCode } from "../config/values";
import { AuthenticateAdmin } from "../middlewares/authentication";
import { BatchUsers } from "../models/batch-users";
import { ResourceError, ValidationError } from "../lib/errors";
import { readEmailAirdropToken } from "../lib/jwt";
import { AirdropStatus, User } from "../models/user";
import { Nft } from "@apillon/sdk";
import { LogType, writeLog } from "../lib/logger";
import { env } from "../config/env";

/**
 * Installs new route on the provided application.
 * @param app ExpressJS application.
 */
export function inject(app: Application) {
  app.post(
    "/users/claim",
    (req: Request, res: Response, next: NextFunction) => {
      resolve(req, res).catch(next);
    }
  );
}

export async function resolve(req: Request, res: Response): Promise<void> {
  const { context, body } = req;

  if (!body.signature) {
    throw new ResourceError(RouteErrorCode.SIGNATURE_NOT_PRESENT);
  }

  // TODO get wallet:
  const wallet = body.signature;

  if (!body.jwt) {
    throw new ResourceError(RouteErrorCode.REQUEST_TOKEN_NOT_PRESENT);
  }
  const email = readEmailAirdropToken(body.jwt);
  if (!email) {
    throw new ResourceError(RouteErrorCode.REQUEST_TOKEN_INVALID);
  }

  const user = await new User({}, context).populateByEmail(email.email);

  if (!user.exists()) {
    throw new ResourceError(RouteErrorCode.USER_DOES_NOT_EXIST);
  }

  user.airdrop_status = AirdropStatus.WALLET_LINKED;
  user.wallet = wallet;

  await user.update();

  const collection = new Nft({
    key: env.APILLON_KEY,
    secret: env.APILLON_SECRET,
  }).collection(env.COLLECTION_UUID);

  try {
    const res = await collection.mint(wallet, 1);
    user.airdrop_status = res.success
      ? AirdropStatus.AIRDROP_COMPLETED
      : AirdropStatus.AIRDROP_ERROR;
  } catch (e) {
    writeLog(LogType.ERROR, e, "claim-airdrop.ts", "resolve");
    user.airdrop_status = AirdropStatus.AIRDROP_ERROR;
  }

  await user.update();
  return res.respond(200, { success: "ok" });
}
