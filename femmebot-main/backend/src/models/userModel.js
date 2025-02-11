// src/models/userModel.js
const supabase = require('../config/supabaseClient');

const getUserById = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

const createUser = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert(userData);
  if (error) throw error;
  return data;
};

module.exports = { getUserById, createUser };
