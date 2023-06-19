module.exports = (err, req, res, next) => {
  console.log(err);
  const { errors: validatorErrors } = err;
  const errors = [];
  for (let field in validatorErrors) {
    const { path, value, message } = validatorErrors[field];
    errors.push({
      message: message,
      field: path,
      value: value,
    });
  }
  code = 400;
  res.status(code).json({ status: code, errors });
};
