test("POST to /api/v1/migrations should return 200", async () => {
  
  const response1 = await fetch("http:localhost:3000/api/v1/migrations", {method: "POST"});

  const response2 = await fetch("http:localhost:3000/api/v1/migrations", {method: "POST"});

  const response3 = await fetch("http:localhost:3000/api/v1/migrations", {method: "DELETE"});

  const response1Body = await response1.json();
  const response2Body = await response2.json();

  expect(response1.status).toBe(201);
  expect(Array.isArray(response1Body)).toBe(true);

  expect(response2.status).toBe(200);
  expect(Array.isArray(response2Body)).toBe(true);
  expect(response2Body.length).toBe(0);

  expect(response3.status).toBe(405);
});