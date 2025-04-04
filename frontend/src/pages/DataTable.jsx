import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import './DataTable.css';

const DataTable = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [genCount, setGenCount] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    revenue: '',
    profit: '',
    employees: '',
    country: ''
  });
  
  const generationInterval = useRef(null);

  // Fetch companies on component mount
  useEffect(() => {
    fetchCompanies();
    
    // Cleanup interval on unmount
    return () => {
      if (generationInterval.current) {
        clearInterval(generationInterval.current);
      }
    };
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await api.getCompanies();
      setCompanies(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch company data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartGeneration = () => {
    setGenerating(true);
    
    // Generate data immediately
    generateData();
    
    // Set interval for continuous generation
    generationInterval.current = setInterval(generateData, 2000);
  };

  const handleStopGeneration = () => {
    if (generationInterval.current) {
      clearInterval(generationInterval.current);
      generationInterval.current = null;
    }
    setGenerating(false);
  };

  const generateData = async () => {
    try {
      const response = await api.generateData(genCount);
      setCompanies(prev => [...prev, ...response.data]);
    } catch (err) {
      console.error('Error generating data:', err);
      handleStopGeneration();
    }
  };

  const handleEdit = (company) => {
    setEditingId(company.id);
    setFormData({
      name: company.name,
      revenue: company.revenue,
      profit: company.profit,
      employees: company.employees,
      country: company.country
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) {
      return;
    }
    
    try {
      await api.deleteCompany(id);
      setCompanies(companies.filter(company => company.id !== id));
    } catch (err) {
      console.error('Error deleting company:', err);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        revenue: parseFloat(formData.revenue),
        profit: parseFloat(formData.profit),
        employees: parseInt(formData.employees)
      };
      
      if (editingId) {
        // Update existing company
        const response = await api.updateCompany(editingId, data);
        setCompanies(companies.map(company => 
          company.id === editingId ? response.data : company
        ));
      } else {
        // Create new company
        const response = await api.createCompany(data);
        setCompanies([...companies, response.data]);
      }
      
      // Reset form
      resetForm();
    } catch (err) {
      console.error('Error saving company:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      revenue: '',
      profit: '',
      employees: '',
      country: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading && companies.length === 0) {
    return <div className="loading">Loading data...</div>;
  }

  return (
    <div className="data-table-page">
      <h1 className="page-title">Company Data</h1>
      
      <div className="data-controls">
        <button 
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Hide Form' : 'Add Company'}
        </button>
        
        <div className="generation-controls">
          <input
            type="number"
            min="1"
            max="50"
            value={genCount}
            onChange={(e) => setGenCount(parseInt(e.target.value) || 1)}
            disabled={generating}
            className="gen-count-input"
          />
          
          {!generating ? (
            <button 
              className="btn btn-success"
              onClick={handleStartGeneration}
            >
              Generate Data
            </button>
          ) : (
            <button 
              className="btn btn-danger"
              onClick={handleStopGeneration}
            >
              Stop Generation
            </button>
          )}
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {showForm && (
        <div className="company-form-container">
          <h2>{editingId ? 'Edit Company' : 'Add New Company'}</h2>
          <form onSubmit={handleFormSubmit} className="company-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Company Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="revenue">Revenue</label>
                <input
                  type="number"
                  id="revenue"
                  name="revenue"
                  value={formData.revenue}
                  onChange={handleFormChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="profit">Profit</label>
                <input
                  type="number"
                  id="profit"
                  name="profit"
                  value={formData.profit}
                  onChange={handleFormChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="employees">Employees</label>
                <input
                  type="number"
                  id="employees"
                  name="employees"
                  value={formData.employees}
                  onChange={handleFormChange}
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Save'} Company
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {companies.length === 0 ? (
        <div className="no-data">
          No company data available. Please upload an Excel file or generate data.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Revenue</th>
                <th>Profit</th>
                <th>Employees</th>
                <th>Country</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map(company => (
                <tr key={company.id}>
                  <td>{company.name}</td>
                  <td>${parseFloat(company.revenue).toLocaleString()}</td>
                  <td>${parseFloat(company.profit).toLocaleString()}</td>
                  <td>{company.employees}</td>
                  <td>{company.country}</td>
                  <td className="actions">
                    <button 
                      className="btn btn-sm btn-edit"
                      onClick={() => handleEdit(company)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-delete"
                      onClick={() => handleDelete(company.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DataTable;
