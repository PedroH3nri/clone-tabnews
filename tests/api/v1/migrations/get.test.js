import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("GET to /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Retrieving Dry-Run migrations", async () => {
      const response = await fetch("http:localhost:3000/api/v1/migrations");
      expect(response.status).toBe(201);

      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);

      expect(responseBody.length).toBeGreaterThan(0);
    });
  });
});
