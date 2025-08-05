import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("POST to /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("should return 200", async () => {
      const response = await fetch("http:localhost:3000/api/v1/status", {
        method: "POST",
      });
      expect(response.status).toBe(405);

      const responseBody = await response.json();

      console.log(responseBody);

      expect(responseBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Método não permitido para esse endpoint.",
        action:
          "Verifique se o método HTTP enviado é válido para esse endpoint",
        status_code: 405,
      });
    });
  });
});
