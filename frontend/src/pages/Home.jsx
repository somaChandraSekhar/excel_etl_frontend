import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <h1>Excel Data Visualization</h1>
        <p className="hero-text">Upload, manage, and visualize your Excel data</p>
        <div className="hero-buttons">
          <Link to="/upload" className="btn btn-primary">Upload Excel</Link>
          <Link to="/data" className="btn btn-secondary">View Data</Link>
          <Link to="/charts" className="btn btn-tertiary">View Charts</Link>
        </div>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <h2>Excel Upload</h2>
          <p>Upload your Excel files with company data including name, revenue, profit, employees, and country.</p>
        </div>
        
        <div className="feature-card">
          <h2>Data Management</h2>
          <p>Add, edit, delete company records or generate random data for testing.</p>
        </div>
        
        <div className="feature-card">
          <h2>Visualizations</h2>
          <p>Create bar charts, pie charts, scatter plots, and heatmaps to visualize your data.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
