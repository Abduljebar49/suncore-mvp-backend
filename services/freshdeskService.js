const axios = require('axios');
const querystring = require('querystring');

require('dotenv').config();

const FRESHDESK_BASE_URL = `https://${process.env.FRESHDESK_DOMAIN}/api/v2`;

const auth = {
  username: process.env.FRESHDESK_API_KEY || '',
  password: 'X',
};

class FreshdeskService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: FRESHDESK_BASE_URL,
      auth,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for consistent error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          const freshdeskError = new Error(
            error.response.data?.message ||
              error.response.data?.errors?.message ||
              'Freshdesk API request failed'
          );
          freshdeskError.status = error.response.status;
          freshdeskError.details = error.response.data;
          throw freshdeskError;
        } else if (error.request) {
          // The request was made but no response was received
          throw new Error('No response received from Freshdesk API');
        } else {
          // Something happened in setting up the request
          throw new Error(`Error setting up request: ${error.message}`);
        }
      }
    );
  }

  // Ticketing System
  async createTicket(ticketData) {
    const response = await this.axiosInstance.post('/tickets', ticketData);
    return response.data;
  }

  async updateTicket(id, updates) {
    const response = await this.axiosInstance.put(`/tickets/${id}`, updates);
    return response.data;
  }

  async getTicket(id, queryParams = {}) {
    const baseParams = {
      ...queryParams,
      include: 'requester,company',
    };
    const query = querystring.stringify(baseParams);
    const response = await this.axiosInstance.get(`/tickets/${id}?${query}`);
    return response.data;
  }

  async getAllTickets(queryParams = {}) {
    const baseParams = {
      ...queryParams,
      include: 'requester,company',
    };
    const query = querystring.stringify(baseParams);
    const response = await this.axiosInstance.get(`/tickets?${query}`);
    return response.data;
  }

  // Knowledge Base / FAQs
  async createCategory(name, description) {
    const response = await this.axiosInstance.post('/solutions/categories', {
      name,
      description,
    });
    return response.data;
  }

  async createFolder(categoryId, name, visibility, description) {
    const response = await this.axiosInstance.post(`/solutions/categories/${categoryId}/folders`, {
      name,
      visibility,
      description,
    });
    return response.data;
  }

  async createArticle(folderId, articleData) {
    const response = await this.axiosInstance.post(
      `/solutions/folders/${folderId}/articles`,
      articleData
    );
    return response.data;
  }

  async updateArticle(articleId, updates) {
    const response = await this.axiosInstance.put(`/solutions/articles/${articleId}`, updates);
    return response.data;
  }

  async getArticle(articleId) {
    const response = await this.axiosInstance.get(`/solutions/articles/${articleId}`);
    return response.data;
  }

  async searchArticles(query, categoryId) {
    let url = `/search/solutions?term=${encodeURIComponent(query)}`;
    if (categoryId) {
      url += `&category_id=${categoryId}`;
    }
    const response = await this.axiosInstance.get(url);
    return response.data;
  }

  // Contacts/Users Management
  async getAllContacts(queryParams = {}) {
    const cleanParams = {};
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        cleanParams[key] = value.toString();
      }
    });
    const query = querystring.stringify(cleanParams);
    const response = await this.axiosInstance.get(`/contacts?${query}`);
    return response.data;
  }

  async createContact(contactData) {
    const response = await this.axiosInstance.post('/contacts', contactData);
    return response.data;
  }

  async getContact(id) {
    const response = await this.axiosInstance.get(`/contacts/${id}`);
    return response.data;
  }

  async updateContact(id, data) {
    const response = await this.axiosInstance.put(`/contacts/${id}`, data);
    return response.data;
  }

  // Companies API
  async createCompany(companyData) {
    const response = await this.axiosInstance.post('/companies', companyData);
    return response.data;
  }

  async getCompany(id) {
    const response = await this.axiosInstance.get(`/companies/${id}`);
    return response.data;
  }

  async getAllCompanies(queryParams = {}) {
    const cleanParams = {};
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        cleanParams[key] = value.toString();
      }
    });

    const query = querystring.stringify(cleanParams);
    const response = await this.axiosInstance.get(`/companies?${query}`);
    return response.data;
  }

  async updateCompany(id, updates) {
    const response = await this.axiosInstance.put(`/companies/${id}`, updates);
    return response.data;
  }

  async searchCompanies(query) {
    const response = await this.axiosInstance.get(
      `/search/companies?query=${encodeURIComponent(query)}`
    );
    return response.data;
  }

  async createTimeEntry(ticketId, timeData) {
    const response = await this.axiosInstance.post(`/tickets/${ticketId}/time_entries`, timeData);
    return response.data;
  }

  async getAllAgents() {
    const response = await this.axiosInstance.get('/agents');
    return response.data;
  }

  async getAgent(id) {
    const response = await this.axiosInstance.get(`/agents/${id}`);
    return response.data;
  }

  async updateAgent(id, updates) {
    const response = await this.axiosInstance.put(`/agents/${id}`, updates);
    return response.data;
  }
}

module.exports = new FreshdeskService();
