import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";
import database from "infra/database.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST to /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http:localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "pedro123",
          email: "pedroh@curso.dev",
          password: "senha@123",
        }),
      });

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "pedro123",
        email: "pedroh@curso.dev",
        password: "senha@123",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(response.status).toBe(201);
    });

    test("Duplicated Email", async () => {
      const response1 = await fetch("http:localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "pedro",
          email: "pedroH@curso.dev",
          password: "senha@123",
        }),
      });
      expect(response1.status).toBe(400);

      const response1Body = await response1.json();

      expect(response1Body).toEqual({
        name: "ValidationError",
        action: "Utilize outro email para realizar o cadastro.",
        message: "O email informado já está sendo utilizado.",
        status_code: 400,
      });
    });

    test("Duplicated Username", async () => {
      const response1 = await fetch("http:localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "pedro123",
          email: "usernameduplicado1@curso.dev",
          password: "senha@123",
        }),
      });
      expect(response1.status).toBe(400);

      const response1Body = await response1.json();

      expect(response1Body).toEqual({
        name: "ValidationError",
        action: "Utilize outro username para realizar o cadastro.",
        message: "O username informado já está sendo utilizado.",
        status_code: 400,
      });
    });
  });
});
