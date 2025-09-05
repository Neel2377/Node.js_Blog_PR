// Check if user is logged in
exports.isAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect('/login'); // redirect if not logged in
};

// Restrict routes based on roles
exports.allowUsers = (roles = []) => {
  return (req, res, next) => {
    if (!(req.session && req.session.userId)) {
      return res.redirect('/login');
    }
    if (roles.length && !roles.includes(req.session.role)) {
      return res.status(403).send('Forbidden');
    }
    next();
  };
};
  