import * as jwt from 'jsonwebtoken';
import { RequestToken } from '../config/values';
import { Context } from '../context';
import { env } from '../config/env';

/**
 * Generates a new request token needed to verify profile/email. Request token expires in one day.
 * @param email
 * @param ctx
 */
export function generateEmailAirdropToken(email: string) {
  if (!email) {
    return null;
  }
  const exp = '30 days';
  const subject = RequestToken.AIRDROP_EMAIL;
  const token = jwt.sign({ email }, env.APP_SECRET, {
    subject,
    expiresIn: exp,
  });

  return token;
}

/**
 * Generates a new authentication token.
 * @param wallet Wallet address.
 * @param ctx Request context.
 */
export function generateAdminAuthToken(wallet: string, exp?: string | number) {
  if (!exp) {
    exp = '12h';
  }
  if (!wallet) {
    return null;
  }
  const subject = RequestToken.AUTH_ADMIN;
  const token = jwt.sign({ wallet }, env.APP_SECRET, {
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
export function readAdminAuthToken(token: string) {
  const subject = RequestToken.AUTH_ADMIN;
  try {
    const { wallet } = jwt.verify(token, env.APP_SECRET, {
      subject,
    }) as any;
    if (wallet && env.ADMIN_WALLET.includes(wallet.toLowerCase())) {
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

/**
 * Parses a request token needed to verify profile/email. Request token expires in one day.
 * @param token Request token.
 * @param ctx Request context.
 */
export function readEmailAirdropToken(token: string) {
  const subject = RequestToken.AIRDROP_EMAIL;
  try {
    const { email } = jwt.verify(token, env.APP_SECRET, {
      subject,
    }) as any;
    console.log();
    if (email) {
      return {
        email: email as string,
        subject,
      };
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
}
