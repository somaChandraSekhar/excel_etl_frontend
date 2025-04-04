import axios from 'axios';

const API_URL = 'https://excel-etl.azurewebsites.net/api';

// const API_URL = import.meta.env.PROD 
//   ? 'https://your-backend-app-name.azurewebsites.net/api'  // Update with your actual backend URL
//   : 'http://localhost:8000/api';
const api = {
  // Company operations
  getCompanies: () => axios.get(`${API_URL}/companies/`),
  getCompany: (id) => axios.get(`${API_URL}/companies/${id}/`),
  createCompany: (data) => axios.post(`${API_URL}/companies/`, data),
  updateCompany: (id, data) => axios.put(`${API_URL}/companies/${id}/`, data),
  deleteCompany: (id) => axios.delete(`${API_URL}/companies/${id}/`),
  
  // File upload
  uploadExcel: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_URL}/companies/upload_excel/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Data generation
  generateData: (count = 5) => axios.post(`${API_URL}/companies/generate_data/`, { count }),
  
  // Chart data
  getChartData: () => axios.get(`${API_URL}/companies/chart_data/`),
};

export default api;
