import * as jwt from "jsonwebtoken";
import { RequestToken } from "../config/values";
import { Context } from "../context";
import { env } from "../config/env";

/**
 * Generates a new authentication token.
 * @param wallet Wallet address.
 * @param ctx Request context.
 */
export function generateAdminAuthToken(
  wallet: string,
  ctx: Context,
  exp?: string | number
) {
  if (!exp) {
    exp = "12h";
  }
  if (!wallet) {
    return null;
  }
  const subject = RequestToken.AUTH_ADMIN;
  const token = jwt.sign({ wallet }, ctx.env.APP_SECRET, {
    subject,
    expiresIn: exp,
  });
  return token;
}

/**
 * Returns authentication token data.
 * @param token Authentication token.
 * @param ctx Request context.
 */
export async function readAdminAuthToken(token: string, ctx: Context) {
  const subject = RequestToken.AUTH_ADMIN;
  try {
    const { wallet } = jwt.verify(token, ctx.env.APP_SECRET, {
      subject,
    }) as any;
    if (wallet && wallet.toLowerCase() === env.ADMIN_WALLET) {
      return {
        wallet,
        subject,
      };
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
}
