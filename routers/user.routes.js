const express = require('express');
const router = express.Router();
const passport = require('../middlewares/passport');
const userController = require('../controllers/userController');

// Register user
router.post('/', userController.createUser);

// Login route (Passport local strategy)
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: false // you can enable flash messages if needed
  })
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/login');
  });
});

// Get all users (protected)
router.get('/', userController.getUsers);

// User management page
router.get('/manage', userController.userManagementPage);

// Profile routes (protected)
router.get('/profile', require('../middlewares/auth').isAuth, userController.profilePage);
router.put('/profile', require('../middlewares/auth').isAuth, userController.updateProfile);
router.delete('/profile', require('../middlewares/auth').isAuth, userController.deleteProfile);

// Single user CRUD
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
