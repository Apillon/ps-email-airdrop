import {
  createContextAndStartServer,
  Stage,
  stopServerAndCloseMySqlContext,
} from '../helpers/context';
import * as request from 'supertest';
import { setupTestDatabase, clearTestDatabase } from '../helpers/migrations';
import { AirdropStatus, User } from '../../models/user';
import { env } from '../../config/env';
import { generateAdminAuthToken } from '../../lib/jwt';
import { ethers } from 'ethers';
let stage: Stage;
let token;

describe('get statistics', () => {
  beforeAll(async () => {
    stage = await createContextAndStartServer();
    token = generateAdminAuthToken(env.ADMIN_WALLET[0]);
    await setupTestDatabase();
    await new User({}, stage.context).fake().create();
    await new User({}, stage.context)
      .fake()
      .populate({
        email: 'test2@email.com',
        airdrop_status: AirdropStatus.EMAIL_SENT,
      })
      .create();
    await new User({}, stage.context)
      .fake()
      .populate({
        email: 'test3@email.com',
        airdrop_status: AirdropStatus.EMAIL_ERROR,
      })
      .create();
    await new User({}, stage.context)
      .fake()
      .populate({
        email: 'test4@email.com',
        airdrop_status: AirdropStatus.AIRDROP_COMPLETED,
      })
      .create();
  });

  afterAll(async () => {
    await clearTestDatabase();
    await stopServerAndCloseMySqlContext(stage);
  });

  test('gets statistics', async () => {
    const res = await request(stage.app)
      .get('/users/statistics')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({
      total: 4,
      pending: 1,
      emailSent: 2,
      walletLinked: 1,
      airdropped: 1,
      threwError: 1,
    });
  });
});
