import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import RewardsPage from './pages/RewardsPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/reward" element={<RewardsPage />} />
    </Routes>
  </BrowserRouter>
);

