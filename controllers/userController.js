// View user profile
exports.profilePage = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId, '-password');
    if (!user) return res.redirect('/login');
    res.render('./pages/user/profile', { user });
  } catch (err) {
    res.status(500).send('Error loading profile');
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const update = {
      username: req.body.username,
      email: req.body.email
    };
    if (req.body.password) {
      const bcrypt = require('bcrypt');
      update.password = await bcrypt.hash(req.body.password, 10);
    }
    const user = await User.findByIdAndUpdate(req.session.userId, update, { new: true, runValidators: true, select: '-password' });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete user profile
exports.deleteProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.session.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    req.session.destroy(() => {
      res.json({ message: 'Profile deleted' });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Render user management page
exports.userManagementPage = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.render('./pages/user/userManagement', { users });
  } catch (err) {
    res.status(500).send('Error loading users');
  }
};
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, password, role, email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single user by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ error: 'No data provided' });
    const { username, password, role, email } = req.body;
    const update = { username, role };
    if (email) update.email = email;
    if (password) update.password = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
