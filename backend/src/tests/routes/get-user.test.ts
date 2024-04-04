import {
  createContextAndStartServer,
  Stage,
  stopServerAndCloseMySqlContext,
} from '../helpers/context';
import * as request from 'supertest';
import { setupTestDatabase, clearTestDatabase } from '../helpers/migrations';
import { User } from '../../models/user';
import { env } from '../../config/env';
import { generateAdminAuthToken } from '../../lib/jwt';
import { ethers } from 'ethers';
let stage: Stage;
let token;

describe('get user', () => {
  beforeAll(async () => {
    stage = await createContextAndStartServer();
    token = generateAdminAuthToken(env.ADMIN_WALLET[0]);
    await setupTestDatabase();
    await new User({}, stage.context).fake().create();
  });

  afterAll(async () => {
    await clearTestDatabase();
    await stopServerAndCloseMySqlContext(stage);
  });

  test('fails getting user if not admin', async () => {
    const res = await request(stage.app).get('/users');
    expect(res.status).toBe(403);

    const res2 = await request(stage.app)
      .get('/users')
      .set(
        'Authorization',
        `Bearer ${generateAdminAuthToken(ethers.Wallet.createRandom().address)}`
      );
    expect(res2.status).toBe(403);
  });

  test('get user', async () => {
    const res = await request(stage.app).get('/users').set('Authorization', `Bearer ${token}`);

    expect(res.body.data.items.length).toBe(1);
    expect(res.body.data.total).toBe(1);
  });
});
