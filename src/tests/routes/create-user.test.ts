import {
  createContextAndStartServer,
  Stage,
  stopServerAndCloseMySqlContext,
} from "../helpers/context";
import * as request from "supertest";
import { setupTestDatabase, clearTestDatabase } from "../helpers/migrations";
let stage: Stage;

describe.skip("create user", () => {
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

    expect(res.status).toBe(201);
    const dbRes = await stage.context.mysql.paramExecute("SELECT * FROM user");
    expect(dbRes.length).toBeGreaterThan(0);
  });
});
