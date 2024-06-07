import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CompanyList from './components/CompanyList';
import CompanyDetails from './components/CompanyDetails';
import './App.css';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/companies" element={<CompanyList />} />
          <Route path="/company/:id" element={<CompanyDetails />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
