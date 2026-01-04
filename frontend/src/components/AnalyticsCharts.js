import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function AnalyticsCharts({ analytics }) {
  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];

  return (
    <div>
      {/* Time Series Chart */}
      <div className="card">
        <h3>📊 Transaction Trends Over Time</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.timeSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="totalAmount" stroke="#667eea" name="Total Amount ($)" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="count" stroke="#764ba2" name="Transaction Count" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Success vs Failed */}
      <div className="card">
        <h3>✅ Transaction Success Rate Over Time</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.timeSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="successCount" fill="#10b981" name="Successful" />
              <Bar dataKey="failedCount" fill="#ef4444" name="Failed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Merchant Analytics */}
      <div className="card">
        <h3>🏪 Top Merchants by Volume</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.merchants.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="merchant" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalAmount" fill="#667eea" name="Total Amount ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Card Type Distribution */}
      <div className="card">
        <h3>💳 Card Type Distribution</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.cardTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ cardType, percentage }) => `${cardType}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {analytics.cardTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Merchant Performance Table */}
      <div className="card">
        <h3>📋 Merchant Performance Details</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Merchant</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Transactions</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Total Amount</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {analytics.merchants.slice(0, 10).map((merchant, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '10px' }}>{merchant.merchant}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>{merchant.transactionCount}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>${merchant.totalAmount.toFixed(2)}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>
                    {((merchant.successCount / merchant.transactionCount) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsCharts;
