import httpStatus from "http-status";

export function handleApplicationErrors(err, req, res, next) {
  if (err.name === "ConflictError" || err.name === "DuplicatedError") {
    return res
      .status(httpStatus.CONFLICT)
      .send({ message: err.message, errors: err.errors, email: err.email });
  }

  if (err.name === "UnauthorizedError") {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .send({ message: err.message, errors: err.errors });
  }

  if (err.name === "ValidationError") {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .send({ message: err.message, errors: err.errors });
  }

  if (err.name === "NotFoundError") {
    return res
      .status(httpStatus.NOT_FOUND)
      .send({ message: err.message, errors: err.errors });
  }

  if (err.name === "InvalidCredentialsError") {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .send({ message: err.message, errors: err.errors });
  }
  if (err.name === "UnprocessableEntityError") {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .send({ message: err.message, errors: err.errors });
  }
  if (
    err.name === "DoctorNotFoundError" ||
    err.name === "PatientNotFoundError"
  ) {
    return res
      .status(httpStatus.NOT_FOUND)
      .send({ message: err.message, errors: err.errors });
  }

  if (err.name === "AppointmentNotFoundError") {
    return res
      .status(httpStatus.NOT_FOUND)
      .send({ message: err.message, errors: err.errors });
  }

  if (err.name === "InvalidStateError") {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .send({ message: err.message, errors: err.errors });
  }

  if (err.name === "InvalidCityError") {
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .send({ message: err.message, errors: err.errors });
  }

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    error: "Internal Server Error",
    message: err.message,
    errors: err.errors,
  });
}
