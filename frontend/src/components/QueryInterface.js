import React, { useState } from 'react';
import { insightsAPI } from '../services/api';

function QueryInterface({ reportId, report }) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await insightsAPI.query(query, reportId);
      setResponse(res.data.data.response);
    } catch (error) {
      console.error('Error processing query:', error);
      setResponse('Sorry, I encountered an error processing your query.');
    }
    setLoading(false);
  };

  const sampleQueries = [
    'What is the total transaction amount?',
    'How many transactions failed?',
    'What is the average transaction amount?',
    'How many successful transactions are there?'
  ];

  return (
    <div className="card">
      <h2>💬 Ask AI About Your Report</h2>
      <p>Ask questions about your payment data in natural language.</p>
      
      <div className="query-box">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="query-input"
            placeholder="Ask a question about your payment data..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !query.trim()}
          >
            {loading ? 'Processing...' : 'Ask AI'}
          </button>
        </form>

        {response && (
          <div className="query-response">
            <strong>AI Response:</strong>
            <p style={{ marginTop: '10px' }}>{response}</p>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <h4>Sample Questions:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
            {sampleQueries.map((sample, idx) => (
              <button
                key={idx}
                className="btn btn-secondary"
                onClick={() => setQuery(sample)}
                style={{ fontSize: '0.9em' }}
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QueryInterface;
