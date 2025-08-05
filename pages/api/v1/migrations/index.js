import database from "infra/database.js";
import { createRouter } from "next-connect";
import {
  InternalServerError,
  MethodNotAllowedError,
} from "infra/errors/errors";

const router = createRouter();

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

function onNoMatchHandler(request, response) {
  const error = new MethodNotAllowedError();

  response.status(405).json(error);
}

function onErrorHandler(error, request, response) {
  const publicError = new InternalServerError({ cause: error });

  console.log("Erro dentro do catch do next-connect: Migrations");
  console.error(publicError);

  response.status(500).json(publicError);
}

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
