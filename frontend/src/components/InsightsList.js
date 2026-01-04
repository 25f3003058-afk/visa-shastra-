import React from 'react';

function InsightsList({ insights }) {
  if (insights.length === 0) {
    return (
      <div className="card">
        <p>No insights available. Click "Generate AI Insights" to analyze this report.</p>
      </div>
    );
  }

  const getSeverityBadgeClass = (severity) => {
    const classes = {
      low: 'badge-low',
      medium: 'badge-medium',
      high: 'badge-high',
      critical: 'badge-critical'
    };
    return classes[severity] || 'badge-low';
  };

  return (
    <div className="card">
      <h2>🤖 AI-Generated Insights</h2>
      <ul className="insight-list">
        {insights.map((insight, idx) => (
          <li key={idx} className={`insight-item ${insight.severity}`}>
            <div className="insight-title">
              {insight.type === 'anomaly' && '⚠️ '}
              {insight.type === 'trend' && '📈 '}
              {insight.type === 'prediction' && '🔮 '}
              {insight.type === 'recommendation' && '💡 '}
              {insight.title}
            </div>
            <div className="insight-description">{insight.description}</div>
            <div className="insight-meta">
              <span className={`badge ${getSeverityBadgeClass(insight.severity)}`}>
                {insight.severity.toUpperCase()}
              </span>
              <span>Confidence: {(insight.confidence * 100).toFixed(0)}%</span>
              <span>Type: {insight.type}</span>
            </div>
            {insight.recommendations && insight.recommendations.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <strong>Recommendations:</strong>
                <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
                  {insight.recommendations.map((rec, recIdx) => (
                    <li key={recIdx} style={{ marginBottom: '3px' }}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InsightsList;
