import {
  InternalServerError,
  MethodNotAllowedError,
} from "infra/errors/errors";

function onNoMatchHandler(request, response) {
  const error = new MethodNotAllowedError();

  response.status(405).json(error);
}

function onErrorHandler(error, request, response) {
  const publicError = new InternalServerError({
    cause: error,
    statusCode: error.statusCode,
  });

  console.error(publicError);
  response.status(publicError.statusCode).json(publicError);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
