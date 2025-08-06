import { createRouter } from "next-connect";
import controller from "infra/controller";
import migrator from "models/migrator";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.get(async (request, response) => {
  const pendingMigrations = await migrator.listPendingMigrations();

  response.status(201).json(pendingMigrations);
});

router.post(async (request, response) => {
  const pendingMigrations = await migrator.runMigrations();

  if (pendingMigrations.length > 0) {
    response.status(201).json(pendingMigrations);
  }

  response.status(200).json(pendingMigrations);
});
