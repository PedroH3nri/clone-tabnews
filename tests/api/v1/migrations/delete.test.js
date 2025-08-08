describe("DELETE to /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("should return 405", async () => {
      const response = await fetch("http:localhost:3000/api/v1/migrations", {
        method: "DELETE",
      });
      expect(response.status).toBe(405);

      const responseBody = await response.json();

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
