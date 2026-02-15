import apiClient from './apiService';

export const reportService = {
  /**
   * Get all reports for the authenticated user
   */
  getAllReports: async () => {
    try {
      const response = await apiClient.get('/reports');
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      }
      throw error;
    }
  },

  /**
   * Get a report by ID
   */
  getReportById: async (id) => {
    try {
      const response = await apiClient.get(`/reports/${id}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      }
      throw error;
    }
  },

  /**
   * Create a new report with file upload
   */
  createReport: async (formData) => {
    try {
      const response = await apiClient.post('/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      }
      throw error;
    }
  },

  /**
   * Update report status
   */
  updateReportStatus: async (id, status, summary) => {
    try {
      const response = await apiClient.patch(`/reports/${id}/status`, {
        status,
        summary,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      }
      throw error;
    }
  },

  /**
   * Delete a report
   */
  deleteReport: async (id) => {
    try {
      const response = await apiClient.delete(`/reports/${id}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      }
      throw error;
    }
  },
};
