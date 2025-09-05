exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/login'); // redirect if not logged in
};

exports.allowUsers = (roles = []) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect('/login');
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).send('Forbidden');
    }
    next();
  };
};
