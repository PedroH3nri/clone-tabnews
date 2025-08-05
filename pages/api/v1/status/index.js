import { createRouter } from "next-connect";
import database from "infra/database.js";
import {
  InternalServerError,
  MethodNotAllowedError,
} from "infra/errors/errors";

const router = createRouter();

router.get(status);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

function onNoMatchHandler(request, response) {
  const error = new MethodNotAllowedError();

  response.status(405).json(error);
}

function onErrorHandler(error, request, response) {
  console.log("Error dentro do catch do next-connect");

  const publicErrorObject = new InternalServerError({ cause: error });

  response.status(500).json(publicErrorObject);
}

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const dbName = process.env.POSTGRES_DB;

  const pgVersionResult = await database.query("SHOW server_version;");
  const pgVersioValue = pgVersionResult.rows[0].server_version;

  const pgMaxConnectionsResult = await database.query("SHOW max_connections;");
  const pgMaxConnectionValue = parseInt(
    pgMaxConnectionsResult.rows[0].max_connections,
  );

  const pgActiveConnectionsResult = await database.query({
    text: `SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1`,
    values: [dbName],
  });
  const pgActiveConnectionValue = pgActiveConnectionsResult.rows[0].count;

  const pgIdleConnectionsResult = await database.query(
    `SELECT COUNT(*)::int FROM pg_stat_activity WHERE state = 'idle' AND datname = '${dbName}'`,
  );
  const pgIdleConnectionsValue = pgIdleConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: pgVersioValue,
        max_connections: pgMaxConnectionValue,
        active_connections: pgActiveConnectionValue,
        idle_connections: pgIdleConnectionsValue,
      },
    },
  });
}
