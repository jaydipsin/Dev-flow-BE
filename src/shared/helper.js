export const generateError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const getErrorMessage = (error) => {
  return error[0].message;
};
