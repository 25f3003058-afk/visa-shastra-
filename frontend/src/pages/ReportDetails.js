import React, { useState, useEffect } from 'react';
import { reportsAPI, insightsAPI, analyticsAPI } from '../services/api';
import InsightsList from '../components/InsightsList';
import AnalyticsCharts from '../components/AnalyticsCharts';
import QueryInterface from '../components/QueryInterface';

function ReportDetails({ reportId, onBack }) {
  const [report, setReport] = useState(null);
  const [insights, setInsights] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadReportData();
  }, [reportId]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const [reportRes, insightsRes, analyticsRes] = await Promise.all([
        reportsAPI.getById(reportId),
        insightsAPI.getByReport(reportId),
        loadAnalytics()
      ]);

      setReport(reportRes.data.data);
      setInsights(insightsRes.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading report data:', error);
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const [timeSeriesRes, merchantsRes, cardTypesRes] = await Promise.all([
        analyticsAPI.getTimeSeries(reportId),
        analyticsAPI.getMerchants(reportId),
        analyticsAPI.getCardTypes(reportId)
      ]);

      setAnalytics({
        timeSeries: timeSeriesRes.data.data,
        merchants: merchantsRes.data.data,
        cardTypes: cardTypesRes.data.data
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handleGenerateInsights = async () => {
    try {
      setLoading(true);
      const response = await insightsAPI.generate(reportId);
      setInsights(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error generating insights:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading report details...</div>;
  }

  if (!report) {
    return <div className="error">Report not found</div>;
  }

  return (
    <div>
      <div className="nav">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <button 
          className="btn btn-primary"
          onClick={handleGenerateInsights}
        >
          🤖 Generate AI Insights
        </button>
      </div>

      <div className="card">
        <h2>{report.title}</h2>
        <div className="grid">
          <div>
            <p><strong>Type:</strong> {report.type}</p>
            <p><strong>Status:</strong> <span className={`badge badge-${report.status === 'active' ? 'low' : 'medium'}`}>{report.status}</span></p>
          </div>
          <div>
            <p><strong>Period:</strong> {new Date(report.period.start).toLocaleDateString()} - {new Date(report.period.end).toLocaleDateString()}</p>
            <p><strong>Created:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>📈 Summary Statistics</h2>
        <div className="grid">
          <div className="stat-card">
            <div className="stat-label">Total Transactions</div>
            <div className="stat-value">{report.summary.totalTransactions}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Amount</div>
            <div className="stat-value">${report.summary.totalAmount.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Successful</div>
            <div className="stat-value" style={{ color: '#10b981' }}>{report.summary.successfulTransactions}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Failed</div>
            <div className="stat-value" style={{ color: '#ef4444' }}>{report.summary.failedTransactions}</div>
          </div>
        </div>
      </div>

      <div className="nav" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
        <button 
          className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`btn ${activeTab === 'insights' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('insights')}
        >
          AI Insights ({insights.length})
        </button>
        <button 
          className={`btn ${activeTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button 
          className={`btn ${activeTab === 'query' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('query')}
        >
          Ask AI
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="card">
          <h3>Recent Transactions</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Amount</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Merchant</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Card Type</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {report.transactions.slice(0, 10).map((txn, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px' }}>{txn.id}</td>
                    <td style={{ padding: '10px' }}>${txn.amount.toFixed(2)}</td>
                    <td style={{ padding: '10px' }}>
                      <span className={`badge badge-${txn.status === 'success' ? 'low' : 'high'}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>{txn.merchant}</td>
                    <td style={{ padding: '10px' }}>{txn.cardType}</td>
                    <td style={{ padding: '10px' }}>{new Date(txn.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <InsightsList insights={insights} />
      )}

      {activeTab === 'analytics' && analytics && (
        <AnalyticsCharts analytics={analytics} />
      )}

      {activeTab === 'query' && (
        <QueryInterface reportId={reportId} report={report} />
      )}
    </div>
  );
}

export default ReportDetails;
