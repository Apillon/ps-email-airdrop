import {
  createContextAndStartServer,
  Stage,
  stopServerAndCloseMySqlContext,
} from "../helpers/context";
import * as request from "supertest";
import { setupTestDatabase, clearTestDatabase } from "../helpers/migrations";
import { User } from "../../models/user";
let stage: Stage;

describe("get user", () => {
  beforeAll(async () => {
    stage = await createContextAndStartServer();
    await setupTestDatabase();
    await new User({}, stage.context).fake().create();
  });

  afterAll(async () => {
    await clearTestDatabase();
    await stopServerAndCloseMySqlContext(stage);
  });

  test("get user", async () => {
    const res = await request(stage.app).get("/users");
    //.set("Authorization", `Bearer ${authAdmin.token}`)

    expect(res.body.data.items.length).toBe(1);
    expect(res.body.data.total).toBe(1);
  });
});
