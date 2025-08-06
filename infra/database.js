import { Client } from "pg";
import { resolve } from "node:path";
import migrationRunner from "node-pg-migrate";
import { InternalServerError, ServiceError } from "./errors/errors";

async function query(queryObject) {
  let client;

  try {
    client = await getNewClient();
    return await client.query(queryObject);
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: "Erro na conexão com Banco ou na Query.",
      cause: error,
    });
    throw serviceErrorObject;
  } finally {
    await client?.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    max: 20,
    idleTimeoutMillis: 10000,
    ssl: process.env.NODE_ENV === "production" ? true : false,
  });

  await client.connect();
  return client;
}

async function runMigrations({ dry_run = true }) {
  const dbClient = await getNewClient();

  const migrateOptions = {
    dbClient: dbClient,
    dryRun: dry_run,
    dir: resolve("infra", "migrations"),
    verbose: true,
    direction: "up",
    migrationsTable: "pgmigrations",
  };

  try {
    return await migrationRunner(migrateOptions);
  } catch (error) {
    console.log(error);
    throw new InternalServerError({ cause: error });
  } finally {
    await dbClient.end();
  }
}

const database = {
  query,
  getNewClient,
  runMigrations,
};

export default database;
