const express = require('express');
const router = express.Router();
const freshdeskController = require('../controllers/freshdeskController');

// ticket related routes
router.post('/tickets', freshdeskController.createTicket);
router.put('/tickets/:id', freshdeskController.updateTicket);
router.get('/tickets/:id', freshdeskController.getTicket);
router.get('/tickets', freshdeskController.getAllTickets);
router.post('/tickets/:ticketId/time_entries', freshdeskController.createTimeEntry);

// contact related routes
router.get('/contacts', freshdeskController.getAllContacts);
router.post('/contacts', freshdeskController.createContact);
router.get('/contacts/:id', freshdeskController.getContact);
router.put('/contacts/:id', freshdeskController.updateContact);

// company related routes
router.post('/companies', freshdeskController.createCompany);
router.get('/companies/:id', freshdeskController.getCompany);
router.get('/companies', freshdeskController.getAllCompanies);
router.put('/companies/:id', freshdeskController.updateCompany);

// agent related routes
router.get('/agents', freshdeskController.getAllAgents);
router.get('/agents/:id', freshdeskController.getAgent);
router.put('/agents/:id', freshdeskController.updateAgent);

// ==================== Knowledge Base Routes ====================
router.post('/solutions/categories', freshdeskController.createCategory);
router.post('/solutions/categories/:categoryId/folders', freshdeskController.createFolder);
router.post('/solutions/folders/:folderId/articles', freshdeskController.createArticle);
router.put('/solutions/articles/:articleId', freshdeskController.updateArticle);
router.get('/solutions/articles/:articleId', freshdeskController.getArticle);
router.get('/solutions/search', freshdeskController.searchArticles);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Freshdesk
 *   description: Endpoints for Freshdesk integration
 */

/**
 * @swagger
 * tags:
 *   name: Freshdesk-Tickets
 *   description: Endpoints for ticket management
 */

/**
 * @swagger
 * tags:
 *   name: Freshdesk-Contacts
 *   description: Endpoints for contact management
 */

/**
 * @swagger
 * tags:
 *   name: Freshdesk-Companies
 *   description: Endpoints for company management
 */

/**
 * @swagger
 * tags:
 *   name: Freshdesk-Agents
 *   description: Endpoints for agent management
 */

/**
 * @swagger
 * tags:
 *   name: Freshdesk-Knowledge Base
 *   description: Endpoints for knowledge base management
 */

/**
 * @swagger
 * /api/v1/freshdesk/tickets:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Freshdesk-Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *                 example: Unable to login to my account
 *               description:
 *                 type: string
 *                 example: I keep getting an error when trying to login
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               priority:
 *                 type: number
 *                 example: 1
 *               status:
 *                 type: number
 *                 example: 2
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Get all tickets
 *     tags: [Freshdesk-Tickets]
 *     responses:
 *       200:
 *         description: List of tickets retrieved successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/freshdesk/tickets/{id}:
 *   get:
 *     summary: Get a specific ticket by ID
 *     tags: [Freshdesk-Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket details retrieved successfully
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update a ticket
 *     tags: [Freshdesk-Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: number
 *                 example: 3
 *               responder_id:
 *                 type: number
 *                 example: 123
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/freshdesk/tickets/{ticketId}/time_entries:
 *   post:
 *     summary: Create time entry for a ticket
 *     tags: [Freshdesk-Tickets]
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               time_spent:
 *                 type: string
 *                 example: "30m"
 *               note:
 *                 type: string
 *                 example: "Initial troubleshooting"
 *     responses:
 *       201:
 *         description: Time entry created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/freshdesk/contacts:
 *   get:
 *     summary: Get all contacts
 *     tags: [Freshdesk-Contacts]
 *     responses:
 *       200:
 *         description: List of contacts retrieved successfully
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new contact
 *     tags: [Freshdesk-Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/freshdesk/contacts/{id}:
 *   get:
 *     summary: Get a specific contact by ID
 *     tags: [Freshdesk-Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact details retrieved successfully
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update a contact
 *     tags: [Freshdesk-Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe Updated
 *               email:
 *                 type: string
 *                 example: john.updated@example.com
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/freshdesk/companies:
 *   get:
 *     summary: Get all companies
 *     tags: [Freshdesk-Companies]
 *     responses:
 *       200:
 *         description: List of companies retrieved successfully
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new company
 *     tags: [Freshdesk-Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Acme Corp
 *               description:
 *                 type: string
 *                 example: Software development company
 *     responses:
 *       201:
 *         description: Company created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/freshdesk/companies/{id}:
 *   get:
 *     summary: Get a specific company by ID
 *     tags: [Freshdesk-Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company details retrieved successfully
 *       404:
 *         description: Company not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update a company
 *     tags: [Freshdesk-Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Acme Corp Updated
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/freshdesk/agents:
 *   get:
 *     summary: Get all agents
 *     tags: [Freshdesk-Agents]
 *     responses:
 *       200:
 *         description: List of agents retrieved successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/freshdesk/agents/{id}:
 *   get:
 *     summary: Get a specific agent by ID
 *     tags: [Freshdesk-Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agent details retrieved successfully
 *       404:
 *         description: Agent not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update an agent
 *     tags: [Freshdesk-Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               available:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Agent updated successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/freshdesk/solutions/categories:
 *   post:
 *     summary: Create a new knowledge base category
 *     tags: [Freshdesk-Knowledge Base]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Getting Started
 *               description:
 *                 type: string
 *                 example: Articles to help you get started
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/freshdesk/solutions/categories/{categoryId}/folders:
 *   post:
 *     summary: Create a new folder in a category
 *     tags: [Freshdesk-Knowledge Base]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Installation
 *               description:
 *                 type: string
 *                 example: Installation guides
 *     responses:
 *       201:
 *         description: Folder created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/freshdesk/solutions/folders/{folderId}/articles:
 *   post:
 *     summary: Create a new article in a folder
 *     tags: [Freshdesk-Knowledge Base]
 *     parameters:
 *       - in: path
 *         name: folderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: How to install on Windows
 *               description:
 *                 type: string
 *                 example: Step-by-step guide for Windows installation
 *               status:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Article created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/freshdesk/solutions/articles/{articleId}:
 *   get:
 *     summary: Get a specific article by ID
 *     tags: [Freshdesk-Knowledge Base]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article details retrieved successfully
 *       404:
 *         description: Article not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update an article
 *     tags: [Freshdesk-Knowledge Base]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated installation guide
 *               description:
 *                 type: string
 *                 example: Updated step-by-step guide
 *     responses:
 *       200:
 *         description: Article updated successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/freshdesk/solutions/search:
 *   get:
 *     summary: Search knowledge base articles
 *     tags: [Freshdesk-Knowledge Base]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results returned successfully
 *       400:
 *         description: Missing search query
 *       500:
 *         description: Server error
 */
