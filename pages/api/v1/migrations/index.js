import migrationRunner from "node-pg-migrate";
import { join } from "node:path"
import database  from "infra/database.js"

export default async function migrations(request, response) {

  if(request.method !== 'GET' && request.method !== 'POST'){
    return response.status(405).end();
  }

  const dbClient = await database.getNewClient();
  
  try{
    
    const defaultMigrationsOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations"
    };

    if(request.method === 'GET'){
      const pendingMigrations = await migrationRunner(defaultMigrationsOptions);
      return response.status(201).json(pendingMigrations);
    }

    if(request.method === 'POST'){
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationsOptions,
        dryRun: false
      });

      return (migratedMigrations.length > 0)
        ? response.status(201).json(migratedMigrations)
        : response.status(200).json(migratedMigrations);
    }

  } catch(error) {

    return response.status(405).end();

  } finally {

    await dbClient.end();
  }
}