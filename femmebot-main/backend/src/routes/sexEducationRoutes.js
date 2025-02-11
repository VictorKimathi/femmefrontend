// sexRoutes.js
/**
 * @swagger
 * tags:
 *   name: Sex Education
 *   description: API for handling sex education queries
 */

const express = require('express');
const SexController = require('../controllers/sexEducationController.js');

const router = express.Router();

/**
 * @swagger
 * /api/sex-education/query:
 *   post:
 *     summary: Handle a sex education query
 *     tags: [Sex Education]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 description: The sex education query
 *     responses:
 *       200:
 *         description: Response generated successfully
 *       400:
 *         description: Invalid request data
 */
router.post('/query', SexController.createEducationResponse);

module.exports = router;
