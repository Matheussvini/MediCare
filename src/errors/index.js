function duplicatedError(type, content) {
  return {
    name: "DuplicatedError",
    message: `The ${type} ${content} is already registered`,
  };
}

function conflictError(message) {
  return {
    name: "ConflictError",
    message,
  };
}

function unprocessableEntityError(message) {
  return {
    name: "UnprocessableEntityError",
    message,
  };
}

function invalidCredentialsError() {
  return {
    name: "InvalidCredentialsError",
    message: "Invalid credentials",
  };
}

function notFoundError(message) {
  return {
    name: "NotFoundError",
    message,
  };
}

function unauthorizedError(message) {
  return {
    name: "UnauthorizedError",
    message,
  };
}

function validationError(message) {
  return {
    name: "ValidationError",
    message,
  };
}


export default {
  duplicatedError,
  conflictError,
  unprocessableEntityError,
  invalidCredentialsError,
  notFoundError,
  unauthorizedError,
  validationError,
};
