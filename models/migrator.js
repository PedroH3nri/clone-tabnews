import { resolve } from "node:path";
import migrationRunner from "node-pg-migrate";
import database from "infra/database";
import { ServiceError } from "infra/errors/errors.js";

const migrateOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  verbose: true,
  direction: "up",
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  const dbClient = await database.getNewClient();

  try {
    const migrations = await migrationRunner({
      ...migrateOptions,
      dbClient,
    });

    return migrations;
  } catch (error) {
    console.log(error);
    throw new ServiceError({
      message: "Erro ao tentar listar Migrations",
      cause: error,
    });
  } finally {
    await dbClient?.end();
  }
}

async function runMigrations() {
  const dbClient = await database.getNewClient();

  try {
    const migrations = await migrationRunner({
      ...migrateOptions,
      dbClient,
      dryRun: false,
    });

    return migrations;
  } catch (error) {
    console.log(error);
    throw new ServiceError({
      message: "Erro ao tentar rodar Migrations",
      cause: error,
    });
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runMigrations,
};

export default migrator;
