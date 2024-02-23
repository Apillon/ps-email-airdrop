import {
  createContextAndStartServer,
  Stage,
  stopServerAndCloseMySqlContext,
} from '../helpers/context';
import * as request from 'supertest';
import { setupTestDatabase, clearTestDatabase } from '../helpers/migrations';
import { AirdropStatus, User } from '../../models/user';
import { generateEmailAirdropToken } from '../../lib/jwt';
import { ethers } from 'ethers';
import { Identity } from '@apillon/sdk';

let stage: Stage;
let user: User;

describe('claim airdrop', () => {
  beforeAll(async () => {
    stage = await createContextAndStartServer();
    await setupTestDatabase();

    user = new User({}, stage.context).fake().populate({ nft_id: 20 });
    await user.create();
  });

  afterAll(async () => {
    await clearTestDatabase();
    await stopServerAndCloseMySqlContext(stage);
  });

  test('successfully claims', async () => {
    const wallet = ethers.Wallet.createRandom();

    const identity = new Identity();
    const message = identity.generateSigningMessage('test');
    const signature = await wallet.signMessage(message.message);

    const data = {
      address: wallet.address,
      timestamp: message.timestamp,
      signature,
      jwt: generateEmailAirdropToken(user.email),
    };

    const res = await request(stage.app).post('/users/claim').send(data);

    expect(res.status).toBe(200);
    const fetchUser = await new User({}, stage.context).populateByEmail(user.email);
    expect(fetchUser.airdrop_status).toEqual(AirdropStatus.AIRDROP_COMPLETED);
    expect(fetchUser.wallet).toEqual(wallet.address);
  });
});
