import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Excel Visualizer
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/upload" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Upload
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/data" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Data
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/charts" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Charts
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
