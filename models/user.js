import database from "infra/database";
import { ServiceError, ValidationError } from "infra/errors/errors.js";

async function create(userInputValues) {
  try {
    const results = await database.query({
      text: `
        INSERT INTO 
          users (username, email, password) 
        VALUES 
          (LOWER($1), LOWER($2), $3) 
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

const user = {
  create,
};

export default user;
