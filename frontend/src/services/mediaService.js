import api from './api';

export const mediaService = {
  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to upload file');
    }
  },

  async getMedia() {
    try {
      const response = await api.get('/media/');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch media');
    }
  },

  async deleteMedia(mediaId) {
    try {
      await api.delete(`/media/${mediaId}`);
    } catch (error) {
      throw new Error('Failed to delete media');
    }
  }
};

// src/services/presentationService.js
import api from './api';

export const presentationService = {
  async createPresentation(presentationData) {
    try {
      const response = await api.post('/presentations/', presentationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create presentation');
    }
  },

  async getPresentations() {
    try {
      const response = await api.get('/presentations/');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch presentations');
    }
  },

  async getPresentation(id) {
    try {
      const response = await api.get(`/presentations/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch presentation');
    }
  },

  async updatePresentation(id, updateData) {
    try {
      const response = await api.put(`/presentations/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update presentation');
    }
  },

  async deletePresentation(id) {
    try {
      await api.delete(`/presentations/${id}`);
    } catch (error) {
      throw new Error('Failed to delete presentation');
    }
  }
};