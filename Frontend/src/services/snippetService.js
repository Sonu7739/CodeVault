import api from './api';

export const snippetService = {
  async createSnippet(snippetData) {
    const response = await api.post('/snippets', snippetData);
    return response.data;
  },

  async getMySnippets(params = {}) {
    const response = await api.get('/snippets/my', { params });
    return response.data;
  },

  async getExploreSnippets(params = {}) {
    const response = await api.get('/snippets/explore', { params });
    return response.data;
  },

  async getSnippetById(id) {
    const response = await api.get(`/snippets/${id}`);
    return response.data;
  },

  async updateSnippet(id, snippetData) {
    const response = await api.put(`/snippets/${id}`, snippetData);
    return response.data;
  },

  async deleteSnippet(id) {
    const response = await api.delete(`/snippets/${id}`);
    return response.data;
  },

  async toggleLike(id) {
    const response = await api.post(`/snippets/${id}/like`);
    return response.data;
  }
};

