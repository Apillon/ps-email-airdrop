import {
  createContextAndStartServer,
  Stage,
  stopServerAndCloseMySqlContext,
} from '../helpers/context';
import * as request from 'supertest';
import { setupTestDatabase, clearTestDatabase } from '../helpers/migrations';
import { HDNodeWallet, Wallet } from 'ethers';
import { Identity } from '@apillon/sdk';
let stage: Stage;
let adminWallet: HDNodeWallet;

describe('admin login', () => {
  beforeAll(async () => {
    adminWallet = Wallet.createRandom();
    stage = await createContextAndStartServer({
      ADMIN_WALLET: [adminWallet.address.toLowerCase()],
    });
    await setupTestDatabase();
  });

  afterAll(async () => {
    await clearTestDatabase();
    await stopServerAndCloseMySqlContext(stage);
  });

  test('login', async () => {
    const timestamp = new Date().getTime();
    const message = `test\n${timestamp}`;

    const signature = await adminWallet.signMessage(message);

    const data = { signature, timestamp, address: adminWallet.address };

    const res = await request(stage.app).post('/login').send(data);

    expect(res.status).toBe(200);
  });
});
