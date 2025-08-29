exports.isAuth = (req, res, next) => {
  return next(); // Allow all users
};

exports.allowUsers = (req, res, next) => {
  return next(); // Allow all users
};
