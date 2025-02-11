// src/services/userService.js
const { getUserById, createUser } = require('../models/userModel');

const fetchUserById = async (id) => {
  return await getUserById(id);
};

const registerUser = async (userData) => {
  return await createUser(userData);
};

module.exports = { fetchUserById, registerUser };
