import database from "infra/database.js";
import { createRouter } from "next-connect";
import controller from "infra/controller";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.get(async (request, response) => {
  const pendingMigrations = await database.runMigrations({
    dry_run: true,
  });

  response.status(201).json(pendingMigrations);
});

router.post(async (request, response) => {
  const pendingMigrations = await database.runMigrations({
    dry_run: false,
  });

  if (pendingMigrations.length > 0) {
    response.status(201).json(pendingMigrations);
  }

  response.status(200).json(pendingMigrations);
});
