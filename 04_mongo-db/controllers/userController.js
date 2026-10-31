const User = require('../models/user');

// GET all users
exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};


// GET single user
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ msg: 'User not found' });
  res.json(user);
};


// POST create user

exports.createUser= async (req,res) => {
    const user = await User.create(req.body);
    res.status(201).json({ msg: 'User created', user });
};


// PUT update user
exports.updateUser = async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ msg: 'User updated', updated });
};


// DELETE user
exports.deleteUser = async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  res.json({ msg: 'User deleted', deleted });
};
