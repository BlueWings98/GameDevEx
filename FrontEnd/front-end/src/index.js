import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SurveyPage from './pages/SurveyPage';
import RewardsPage from './pages/RewardsPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<SurveyPage />} />
      <Route path="/reward" element={<RewardsPage />} />
    </Routes>
  </BrowserRouter>
);

