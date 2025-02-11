const Cycle = require('../models/cycleModel');

// Create a new cycle entry
async function createCycle(data) {
  const cycle = new Cycle(data);
  return await cycle.save();
}

// Retrieve all cycle entries
async function getAllCycles() {
  return await Cycle.find();
}

// Retrieve a cycle entry by ID
async function getCycleById(id) {
  return await Cycle.findById(id);
}

// Update a cycle entry by ID
async function updateCycleById(id, updatedData) {
  return await Cycle.findByIdAndUpdate(id, updatedData, { new: true });
}

// Delete a cycle entry by ID
async function deleteCycleById(id) {
  return await Cycle.findByIdAndDelete(id);
}

// Get fertility information for a cycle
async function getFertilityInfo(id) {
  const cycle = await Cycle.findById(id);
  if (!cycle) return null;
  return cycle.calculateFertility();
}

module.exports = {
  createCycle,
  getAllCycles,
  getCycleById,
  updateCycleById,
  deleteCycleById,
  getFertilityInfo,
};
