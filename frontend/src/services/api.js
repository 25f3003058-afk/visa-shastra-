import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Reports API
export const reportsAPI = {
  getAll: () => api.get('/reports'),
  getById: (id) => api.get(`/reports/${id}`),
  getSummary: (id) => api.get(`/reports/${id}/summary`),
  create: (data) => api.post('/reports', data),
  update: (id, data) => api.put(`/reports/${id}`, data),
  delete: (id) => api.delete(`/reports/${id}`)
};

// Insights API
export const insightsAPI = {
  generate: (reportId) => api.post(`/insights/generate/${reportId}`),
  getByReport: (reportId) => api.get(`/insights/report/${reportId}`),
  getById: (id) => api.get(`/insights/${id}`),
  query: (query, reportId) => api.post('/insights/query', { query, reportId })
};

// Analytics API
export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview'),
  getTimeSeries: (reportId) => api.get(`/analytics/timeseries/${reportId}`),
  getMerchants: (reportId) => api.get(`/analytics/merchants/${reportId}`),
  getCardTypes: (reportId) => api.get(`/analytics/cardtypes/${reportId}`)
};

export default api;
