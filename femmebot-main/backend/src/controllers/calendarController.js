const cycleService = require('../services/cycleService');

// Create a new cycle
async function createCycle(req, res) {
  try {
    const cycle = await cycleService.createCycle(req.body);
    res.status(201).json(cycle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Get all cycles
async function getAllCycles(req, res) {
  try {
    const cycles = await cycleService.getAllCycles();
    res.status(200).json(cycles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get a cycle by ID
async function getCycleById(req, res) {
  try {
    const cycle = await cycleService.getCycleById(req.params.id);
    if (!cycle) {
      return res.status(404).json({ message: 'Cycle not found' });
    }
    res.status(200).json(cycle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update a cycle by ID
async function updateCycleById(req, res) {
  try {
    const updatedCycle = await cycleService.updateCycleById(req.params.id, req.body);
    if (!updatedCycle) {
      return res.status(404).json({ message: 'Cycle not found' });
    }
    res.status(200).json(updatedCycle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Delete a cycle by ID
async function deleteCycleById(req, res) {
  try {
    const deletedCycle = await cycleService.deleteCycleById(req.params.id);
    if (!deletedCycle) {
      return res.status(404).json({ message: 'Cycle not found' });
    }
    res.status(200).json({ message: 'Cycle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get fertility information by cycle ID
async function getFertilityInfo(req, res) {
  try {
    const fertilityInfo = await cycleService.getFertilityInfo(req.params.id);
    if (!fertilityInfo) {
      return res.status(404).json({ message: 'Cycle not found' });
    }
    res.status(200).json(fertilityInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createCycle,
  getAllCycles,
  getCycleById,
  updateCycleById,
  deleteCycleById,
  getFertilityInfo,
};
