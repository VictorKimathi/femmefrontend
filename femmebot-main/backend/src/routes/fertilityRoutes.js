/**
 * @swagger
 * tags:
 *   name: Fertility
 *   description: API for managing fertility-related queries
 */

const express = require('express');
const router = express.Router();
const FertilityController = require('../controllers/fertilityController');

/**
 * @swagger
 * /api/fertility/query:
 *   post:
 *     summary: Handle a fertility query
 *     tags: [Fertility]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 description: The fertility query
 *     responses:
 *       200:
 *         description: Response generated successfully
 *       400:
 *         description: Invalid request data
 */
router.post('/query', FertilityController.handleFertilityQuery);

module.exports = router;
