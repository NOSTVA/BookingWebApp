module.exports = (err, req, res, next) => {
  try {
    if (err.name === "ValidationError")
      return (err = handleValidationError(err, res));

    console.log(err.message);
  } catch (err) {
    console.error(err);
  }
};

const handleValidationError = (err, res) => {
  const status = 400;
  const { errors: validatorErrors } = err;
  const errors = [];
  for (let field in validatorErrors) {
    const { path, value, message } = validatorErrors[field];
    errors.push({
      status,
      message: message,
      field: path,
      value: value,
    });
  }
  return res.status(status).json({ type: err.name, errors });
};

// const handleUnauthorizedError = (err, res) => {
//   const { errors: UnauthorizedErrors } = err;
//   const errors = [];
//   for (let field in validatorErrors) {
//     const { path, value, message } = validatorErrors[field];
//     errors.push({
//       status:
//       message: message,
//       field: path,
//       value: value,
//     });
//   }
//   status = 403;
//   return res.status(code).json({ type: err.name, errors });
// };
