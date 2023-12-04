import {
  createContextAndStartServer,
  Stage,
  stopServerAndCloseMySqlContext,
} from "../helpers/context";
import * as request from "supertest";
import { setupTestDatabase, clearTestDatabase } from "../helpers/migrations";
let stage: Stage;

describe("create user", () => {
  beforeAll(async () => {
    stage = await createContextAndStartServer();
    await setupTestDatabase();
  });

  afterAll(async () => {
    await clearTestDatabase();
    await stopServerAndCloseMySqlContext(stage);
  });

  test("Create user", async () => {
    const data = {
      users: [
        {
          email: "test@test.com",
        },
      ],
    };

    const res = await request(stage.app)
      .post("/users")
      //.set("Authorization", `Bearer ${authAdmin.token}`)
      .send(data);

    console.log(res.body);
    expect(res.status).toBe(201);
  });
});
