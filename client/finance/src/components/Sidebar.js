// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar bg-dark text-white p-3">
      <h4 className="mb-4">Finance App</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink to="/register" className="nav-link text-white" activeclassname="active">
            Register
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/login" className="nav-link text-white" activeclassname="active">
            Login
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/" end className="nav-link text-white" activeclassname="active">
            Finance
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin" className="nav-link text-white" activeclassname="active">
            Admin
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
