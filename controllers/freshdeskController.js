// freshdesk.controller.js
const freshdeskService = require('../services/freshdeskService');

class FreshdeskController {
  async createTicket(req, res) {
    try {
      const ticket = await freshdeskService.createTicket(req.body);
      res.status(201).json(ticket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateTicket(req, res) {
    try {
      const ticket = await freshdeskService.updateTicket(req.params.id, req.body);
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTicket(req, res) {
    try {
      const ticket = await freshdeskService.getTicket(req.params.id, req.query);
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllTickets(req, res) {
    try {
      const tickets = await freshdeskService.getAllTickets(req.query);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Knowledge Base
  async createCategory(req, res) {
    try {
      const category = await freshdeskService.createCategory(req.body.name, req.body.description);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createFolder(req, res) {
    try {
      const folder = await freshdeskService.createFolder(
        req.params.categoryId,
        req.body.name,
        req.body.visibility,
        req.body.description
      );
      res.status(201).json(folder);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createArticle(req, res) {
    try {
      const article = await freshdeskService.createArticle(req.params.folderId, req.body);
      res.status(201).json(article);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateArticle(req, res) {
    try {
      const article = await freshdeskService.updateArticle(req.params.articleId, req.body);
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getArticle(req, res) {
    try {
      const article = await freshdeskService.getArticle(req.params.articleId);
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async searchArticles(req, res) {
    try {
      const articles = await freshdeskService.searchArticles(req.query.term, req.query.category_id);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Contacts/Users Management
  async getAllContacts(req, res) {
    try {
      const contacts = await freshdeskService.getAllContacts(req.query);
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createContact(req, res) {
    try {
      const contact = await freshdeskService.createContact(req.body);
      res.status(201).json(contact);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getContact(req, res) {
    try {
      const contact = await freshdeskService.getContact(req.params.id);
      res.json(contact);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateContact(req, res) {
    try {
      const contact = await freshdeskService.updateContact(req.params.id, req.body);
      res.json(contact);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Companies
  async createCompany(req, res) {
    try {
      const company = await freshdeskService.createCompany(req.body);
      res.status(201).json(company);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCompany(req, res) {
    try {
      const company = await freshdeskService.getCompany(req.params.id);
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllCompanies(req, res) {
    try {
      const companies = await freshdeskService.getAllCompanies(req.query);
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateCompany(req, res) {
    try {
      const company = await freshdeskService.updateCompany(req.params.id, req.body);
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async searchCompanies(req, res) {
    try {
      const companies = await freshdeskService.searchCompanies(req.query.query);
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Time Tracking
  async createTimeEntry(req, res) {
    try {
      const timeEntry = await freshdeskService.createTimeEntry(req.params.ticketId, req.body);
      res.status(201).json(timeEntry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Agents Management
  async getAllAgents(req, res) {
    try {
      const agents = await freshdeskService.getAllAgents();
      res.json(agents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAgent(req, res) {
    try {
      const agent = await freshdeskService.getAgent(req.params.id);
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateAgent(req, res) {
    try {
      const agent = await freshdeskService.updateAgent(req.params.id, req.body);
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new FreshdeskController();
