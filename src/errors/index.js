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

function doctorNotFound(doctor_id) {
  return {
    name: "DoctorNotFoundError",
    message: `Doctor with id ${doctor_id} not found`,
  };
}

function patientNotFound(patient_id) {
  return {
    name: "PatientNotFoundError",
    message: `Patient with id ${patient_id} not found`,
  };
}

function appointmentNotFound(appointment_id) {
  return {
    name: "AppointmentNotFoundError",
    message: `Appointment with id ${appointment_id} not found`,
  };
}

function invalidState(state) {
  return {
    name: "InvalidStateError",
    message: `State ${state} is invalid`,
  };
}

function invalidCity(city) {
  return {
    name: "InvalidCityError",
    message: `City ${city} is invalid`,
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
  doctorNotFound,
  patientNotFound,
  appointmentNotFound,
  invalidState,
  invalidCity,
};
