import api from './api';

export const bookmarkService = {
  async addBookmark(snippetId) {
    const response = await api.post(`/snippets/${snippetId}/bookmark`);
    return response.data;
  },

  async removeBookmark(snippetId) {
    const response = await api.delete(`/snippets/${snippetId}/bookmark`);
    return response.data;
  },

  async getBookmarks(params = {}) {
    const response = await api.get('/bookmarks', { params });
    return response.data;
  }
};

