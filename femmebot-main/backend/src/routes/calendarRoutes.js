/**
 * @swagger
 * tags:
 *   name: Cycles
 *   description: API for managing menstrual cycles
 */

const express = require('express');
const cycleController = require('../controllers/calendarController');
const router = express.Router();

/**
 * @swagger
 * /api/cycles:
 *   post:
 *     summary: Create a new cycle
 *     tags: [Cycles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Last Period Start
 *               - Period Length
 *               - Cycle Length
 *             properties:
 *               Last Period Start:
 *                 type: string
 *                 format: date
 *                 description: Start date of the last period (YYYY-MM-DD)
 *               Period Length:
 *                 type: integer
 *                 description: Duration of the period in days
 *               Cycle Length:
 *                 type: integer
 *                 description: Length of the full cycle in days
 *     responses:
 *       201:
 *         description: Cycle created successfully
 *       400:
 *         description: Invalid request data
 */
router.post('/', cycleController.createCycle);

/**
 * @swagger
 * /api/cycles/fertility/{id}:
 *   get:
 *     summary: Get fertility information for a cycle by ID
 *     tags: [Cycles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the cycle to retrieve fertility information
 *     responses:
 *       200:
 *         description: Fertility information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: object
 *                   properties:
 *                     start:
 *                       type: string
 *                       format: date
 *                     end:
 *                       type: string
 *                       format: date
 *                 ovulationDay:
 *                   type: string
 *                   format: date
 *                 fertileWindow:
 *                   type: object
 *                   properties:
 *                     start:
 *                       type: string
 *                       format: date
 *                     end:
 *                       type: string
 *                       format: date
 *       404:
 *         description: Cycle not found
 */
router.get('/fertility/:id', cycleController.getFertilityInfo);

/**
 * @swagger
 * /api/cycles:
 *   get:
 *     summary: Get all cycles
 *     tags: [Cycles]
 *     responses:
 *       200:
 *         description: List of all cycles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cycle'
 */
router.get('/', cycleController.getAllCycles);

/**
 * @swagger
 * /api/cycles/{id}:
 *   get:
 *     summary: Get a cycle by ID
 *     tags: [Cycles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the cycle to retrieve
 *     responses:
 *       200:
 *         description: Cycle retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cycle'
 *       404:
 *         description: Cycle not found
 */
router.get('/:id', cycleController.getCycleById);

/**
 * @swagger
 * /api/cycles/{id}:
 *   put:
 *     summary: Update a cycle by ID
 *     tags: [Cycles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the cycle to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Last Period Start:
 *                 type: string
 *                 format: date
 *               Period Length:
 *                 type: integer
 *               Cycle Length:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cycle updated successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Cycle not found
 */
router.put('/:id', cycleController.updateCycleById);

/**
 * @swagger
 * /api/cycles/{id}:
 *   delete:
 *     summary: Delete a cycle by ID
 *     tags: [Cycles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the cycle to delete
 *     responses:
 *       200:
 *         description: Cycle deleted successfully
 *       404:
 *         description: Cycle not found
 */
router.delete('/:id', cycleController.deleteCycleById);

module.exports = router;
