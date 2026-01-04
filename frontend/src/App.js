import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Dashboard from './pages/Dashboard';
import ReportDetails from './pages/ReportDetails';
import { reportsAPI } from './services/api';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await reportsAPI.getAll();
      setReports(response.data.data || []);
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  };

  const handleReportSelect = (reportId) => {
    setSelectedReportId(reportId);
    setCurrentView('report-details');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedReportId(null);
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>🤖 AI-Powered Reporting Platform</h1>
          <p>Intelligent, Interactive, and Insight-Driven Payment Analytics</p>
        </header>

        {currentView === 'dashboard' && (
          <Dashboard 
            reports={reports} 
            onReportSelect={handleReportSelect}
            onReportsUpdate={loadReports}
          />
        )}

        {currentView === 'report-details' && selectedReportId && (
          <ReportDetails 
            reportId={selectedReportId}
            onBack={handleBackToDashboard}
          />
        )}
      </div>
    </div>
  );
}

export default App;
