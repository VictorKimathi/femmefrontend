// src/controllers/userController.js
const { fetchUserById, registerUser } = require('../services/userService');

const getUser = async (req, res) => {
  try {
    const user = await fetchUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = await registerUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUser, createUser };
