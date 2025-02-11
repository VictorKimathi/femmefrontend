// routes/issuesRoutes.js

/**
 * @swagger
 * tags:
 *   name: Issues
 *   description: API for managing issues
 */

const express = require('express');
const router = express.Router();
const IssuesController = require('../controllers/issuesController');

/**
 * @swagger
 * /api/issues/create:
 *   post:
 *     summary: Create a new issue
 *     tags: [Issues]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               issue:
 *                 type: string
 *                 description: The issue description
 *     responses:
 *       201:
 *         description: Issue created successfully
 *       400:
 *         description: Invalid request data
 */
router.post('/create', IssuesController.createIssue);

module.exports = router;
