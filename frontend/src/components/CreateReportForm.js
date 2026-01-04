import React, { useState } from 'react';

function CreateReportForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'transaction',
    transactionCount: 50
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Generate sample report data
    const reportData = generateSampleReport(formData);
    onSubmit(reportData);
  };

  const generateSampleReport = (config) => {
    const transactions = [];
    const merchants = ['Amazon', 'Walmart', 'Target', 'Best Buy', 'Apple Store', 'Costco', 'Starbucks'];
    const cardTypes = ['visa', 'mastercard', 'amex', 'discover'];
    const statuses = ['success', 'success', 'success', 'success', 'failed'];
    const types = ['purchase', 'purchase', 'purchase', 'refund'];

    for (let i = 0; i < config.transactionCount; i++) {
      const amount = Math.random() < 0.05 
        ? Math.random() * 5000 + 1000
        : Math.random() * 500 + 10;

      const timestamp = new Date();
      timestamp.setHours(timestamp.getHours() - Math.floor(Math.random() * 24 * 7));

      transactions.push({
        id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat(amount.toFixed(2)),
        currency: 'USD',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        type: types[Math.floor(Math.random() * types.length)],
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        customer: `customer${Math.floor(Math.random() * 1000)}@example.com`,
        cardType: cardTypes[Math.floor(Math.random() * cardTypes.length)],
        timestamp: timestamp,
        metadata: {}
      });
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      title: config.title,
      type: config.type,
      period: {
        start: weekAgo,
        end: now
      },
      transactions: transactions,
      status: 'active',
      metadata: {
        generatedBy: 'user',
        dataSource: 'sample-data'
      }
    };
  };

  return (
    <div className="card">
      <h2>Create New Report</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Report Title *
          </label>
          <input
            type="text"
            className="query-input"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="e.g., Q4 2024 Payment Report"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Report Type *
          </label>
          <select
            className="query-input"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
          >
            <option value="transaction">Transaction Report</option>
            <option value="settlement">Settlement Report</option>
            <option value="chargeback">Chargeback Report</option>
            <option value="reconciliation">Reconciliation Report</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Number of Sample Transactions
          </label>
          <input
            type="number"
            className="query-input"
            value={formData.transactionCount}
            onChange={(e) => setFormData({ ...formData, transactionCount: parseInt(e.target.value) })}
            min="10"
            max="1000"
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn btn-primary">
            Create Report
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateReportForm;
