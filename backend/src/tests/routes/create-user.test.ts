import {
  createContextAndStartServer,
  Stage,
  stopServerAndCloseMySqlContext,
} from '../helpers/context';
import * as request from 'supertest';
import { setupTestDatabase, clearTestDatabase } from '../helpers/migrations';
import { env } from '../../config/env';
import { generateAdminAuthToken } from '../../lib/jwt';
let stage: Stage;
let token;

describe('create user', () => {
  beforeAll(async () => {
    token = generateAdminAuthToken(env.ADMIN_WALLET[0]);
    stage = await createContextAndStartServer();
    await setupTestDatabase();
  });

  afterAll(async () => {
    await clearTestDatabase();
    await stopServerAndCloseMySqlContext(stage);
  });

  test('Create user', async () => {
    const data = {
      users: [
        {
          email: 'test@test.com',
          nft_id: 1,
        },
      ],
    };

    const res = await request(stage.app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(data);

    expect(res.status).toBe(201);
    const dbRes = await stage.context.mysql.paramExecute('SELECT * FROM user');
    console.log(dbRes);
    expect(dbRes.length).toBeGreaterThan(0);
  });
});
