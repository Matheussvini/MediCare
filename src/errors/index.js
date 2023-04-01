function duplicatedEmailError(email) {
  return {
    name: "DuplicatedEmailError",
    message: `The email ${email} is already registered`,
    email,
  };
}

function conflictError(message) {
    return {
        name: "ConflictError",
        message,
    };
}


export default {
    duplicatedEmailError,
    conflictError,
}