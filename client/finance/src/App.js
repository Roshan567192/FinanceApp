// src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from "./components/Login";
import Register from "./components/Register";
import FinanceForm from "./components/FinanceForm";
import AdminPanel from "./components/AdminPanel";

function App() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4" style={{ marginLeft: '200px' }}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<FinanceForm />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<h2>404 - Page Not Found</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
