import api from './api';

export const exportService = {
  async exportToPDF(presentationId) {
    try {
      const response = await api.post(`/export/pdf/${presentationId}`, {}, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'presentation.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error('Failed to export PDF');
    }
  },

  async exportToPPTX(presentationId) {
    try {
      const response = await api.post(`/export/pptx/${presentationId}`, {}, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'presentation.pptx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error('Failed to export PowerPoint');
    }
  },

  async getPreview(presentationId) {
    try {
      const response = await api.get(`/export/preview/${presentationId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to generate preview');
    }
  }
};