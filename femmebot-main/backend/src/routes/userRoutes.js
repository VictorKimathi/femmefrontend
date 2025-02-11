// routes/issuesRoutes.js

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

const express = require('express');
const router = express.Router();
const IssuesController = require('../controllers/issuesController');

/**
 * @swagger
 * /api/users/create:
 *   post:
 *     summary: Create a new user issue
 *     tags: [Users]
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
// router.post('/create', IssuesController.createUser);


module.exports = router;
