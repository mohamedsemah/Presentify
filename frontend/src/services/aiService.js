import api from './api';

export const aiService = {
  async generatePresentation(prompt, numSlides = 5, theme = 'default') {
    try {
      const response = await api.post('/ai/generate-presentation', {
        prompt,
        num_slides: numSlides,
        theme
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to generate presentation');
    }
  },

  async enhanceContent(content, enhancementType = 'improve') {
    try {
      const response = await api.post('/ai/enhance-content', {
        content,
        enhancement_type: enhancementType
      });
      return response.data.enhanced_content;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to enhance content');
    }
  },

  async suggestImages(prompt) {
    try {
      const response = await api.post('/ai/suggest-images', null, {
        params: { prompt }
      });
      return response.data.image_suggestions;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get image suggestions');
    }
  }
};