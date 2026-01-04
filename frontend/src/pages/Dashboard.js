import React, { useState, useEffect } from 'react';
import { analyticsAPI, reportsAPI } from '../services/api';
import CreateReportForm from '../components/CreateReportForm';

function Dashboard({ reports, onReportSelect, onReportsUpdate }) {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      const response = await analyticsAPI.getOverview();
      setOverview(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading overview:', error);
      setLoading(false);
    }
  };

  const handleCreateReport = async (reportData) => {
    try {
      await reportsAPI.create(reportData);
      setShowCreateForm(false);
      onReportsUpdate();
      loadOverview();
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="nav">
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '+ Create New Report'}
        </button>
      </div>

      {showCreateForm && (
        <CreateReportForm 
          onSubmit={handleCreateReport}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {overview && (
        <div className="grid">
          <div className="stat-card">
            <div className="stat-label">Total Reports</div>
            <div className="stat-value">{overview.totalReports}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Reports</div>
            <div className="stat-value">{overview.activeReports}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Transactions</div>
            <div className="stat-value">{overview.totalTransactions.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Amount</div>
            <div className="stat-value">${overview.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </div>
      )}

      <div className="card">
        <h2>📊 Payment Reports</h2>
        {reports.length === 0 ? (
          <p>No reports available. Create your first report to get started!</p>
        ) : (
          <div className="grid">
            {reports.map(report => (
              <div 
                key={report.id} 
                className="card"
                onClick={() => onReportSelect(report.id)}
                style={{ cursor: 'pointer' }}
              >
                <h3>{report.title}</h3>
                <p><strong>Type:</strong> {report.type}</p>
                <p><strong>Transactions:</strong> {report.summary?.totalTransactions || 0}</p>
                <p><strong>Total Amount:</strong> ${(report.summary?.totalAmount || 0).toFixed(2)}</p>
                <p><strong>Status:</strong> <span className={`badge badge-${report.status === 'active' ? 'low' : 'medium'}`}>{report.status}</span></p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
