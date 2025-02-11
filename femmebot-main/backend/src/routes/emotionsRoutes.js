const express = require('express');
const { getEmotionAdvice } = require('../controllers/emotionsController');
const router = express.Router();

router.post('/advice', async (req, res) => {
  try {
    const { emotions } = req.body;
    
    if (!Array.isArray(emotions)) {
      return res.status(400).json({ error: "Emotions must be an array" });
    }
    
    const advice = await getEmotionAdvice(emotions);
    res.json(advice);
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;