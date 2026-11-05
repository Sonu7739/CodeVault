import api from './api';

export const userService = {
  async getUserProfile(username) {
    const response = await api.get(`/users/${username}`);
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  }
};

