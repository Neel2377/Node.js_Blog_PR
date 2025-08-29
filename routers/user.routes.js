const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Create user
router.post('/', userController.createUser);
// Get all users
router.get('/', userController.getUsers);

// User management page (EJS view)
router.get('/manage', userController.userManagementPage);
// User profile routes
router.get('/profile', userController.profilePage);
router.put('/profile', userController.updateProfile);
router.delete('/profile', userController.deleteProfile);
// Get single user
router.get('/:id', userController.getUser);
// Update user
router.put('/:id', userController.updateUser);
// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;
