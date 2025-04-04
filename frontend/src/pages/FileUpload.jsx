import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './FileUpload.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await api.uploadExcel(file);
      setSuccess('File uploaded successfully!');
      
      // Redirect to data page after 2 seconds
      setTimeout(() => {
        navigate('/data');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error uploading file');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <h1 className="page-title">Upload Excel File</h1>
      
      <div className="upload-card">
        <div className="upload-instructions">
          <h2>File Requirements</h2>
          <p>Your Excel file must include the following columns:</p>
          <ul>
            <li><strong>name</strong> - Company name</li>
            <li><strong>revenue</strong> - Company revenue</li>
            <li><strong>profit</strong> - Company profit</li>
            <li><strong>employees</strong> - Number of employees</li>
            <li><strong>country</strong> - Country of operation</li>
          </ul>
        </div>
        
        <form onSubmit={handleSubmit} className="upload-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <div className="file-input-container">
            <input
              type="file"
              id="excel-file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="excel-file" className="file-label">
              {file ? file.name : 'Choose Excel File'}
            </label>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary upload-btn"
            disabled={loading || !file}
          >
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FileUpload;
