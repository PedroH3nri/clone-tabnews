import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public ");
});

describe("POST to /api/v1/migrations", () => {
  describe("Running pendind migrations", () => {
    test("For the first time", async () => {
      const response = await fetch("http:localhost:3000/api/v1/migrations", {
        method: "POST",
      });
      const responseBody = await response.json();
      expect(response.status).toBe(201);
      expect(Array.isArray(responseBody)).toBe(true);
    });

    test("For the second time", async () => {
      const response = await fetch("http:localhost:3000/api/v1/migrations", {
        method: "POST",
      });
      const responseBody = await response.json();
      expect(response.status).toBe(200);
      expect(Array.isArray(responseBody)).toBe(true);
    });

    test("For the invalid method", async () => {
      const response = await fetch("http:localhost:3000/api/v1/migrations", {
        method: "DELETE",
      });
      expect(response.status).toBe(405);
    });
  });
});
