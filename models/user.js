import database from "infra/database";
import {
  NotFoundError,
  ServiceError,
  ValidationError,
} from "infra/errors/errors.js";

async function create(userInputValues) {
  try {
    const results = await database.query({
      text: `
        INSERT INTO 
          users (username, email, password) 
        VALUES 
          ($1, $2, $3) 
        RETURNING 
          *
        ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return results.rows[0];
  } catch (error) {
    if (error.cause.code === "23505") {
      if (error.cause.constraint === "users_username_key") {
        throw new ValidationError({
          message: "O username informado já está sendo utilizado.",
          action: "Utilize outro username para realizar o cadastro.",
          cause: error,
        });
      }

      if (error.cause.constraint === "users_email_key") {
        throw new ValidationError({
          message: "O email informado já está sendo utilizado.",
          action: "Utilize outro email para realizar o cadastro.",
          cause: error,
        });
      }
    }

    throw new ServiceError();
  }
}

async function findOneByUsername(username) {
  const result = await database.query({
    text: `
        SELECT *
        FROM users
        WHERE users.username = $1
        LIMIT 1
      ;`,
    values: [username],
  });

  if (result.rowCount > 0) {
    return result.rows[0];
  }

  throw new NotFoundError({
    message: "Username não encontrado no sistema",
    action: "Verifique se o `username` esta digitado corretamente",
  });
}

const user = {
  create,
  findOneByUsername,
};

export default user;
