/**
 * AI Service for generating insights from payment data
 * Uses AI/ML algorithms to analyze transaction patterns and generate actionable insights
 */
class AIService {
  constructor() {
    this.models = {
      anomalyDetection: 'anomaly-v1',
      trendAnalysis: 'trend-v1',
      prediction: 'prediction-v1',
      nlp: 'nlp-v1'
    };
  }

  /**
   * Analyze payment report and generate insights
   */
  async analyzeReport(report) {
    const insights = [];

    // Anomaly detection
    const anomalies = await this.detectAnomalies(report.transactions);
    insights.push(...anomalies);

    // Trend analysis
    const trends = await this.analyzeTrends(report.transactions);
    insights.push(...trends);

    // Predictive analytics
    const predictions = await this.generatePredictions(report.transactions);
    insights.push(...predictions);

    return insights;
  }

  /**
   * Detect anomalies in transaction data
   */
  async detectAnomalies(transactions) {
    const insights = [];

    // Calculate statistical baselines
    const amounts = transactions.map(t => t.amount);
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const stdDev = Math.sqrt(
      amounts.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / amounts.length
    );

    // Detect unusual transaction amounts (more than 2 standard deviations)
    const anomalousTransactions = transactions.filter(t => 
      Math.abs(t.amount - avg) > 2 * stdDev
    );

    if (anomalousTransactions.length > 0) {
      insights.push({
        type: 'anomaly',
        title: 'Unusual Transaction Amounts Detected',
        description: `Found ${anomalousTransactions.length} transactions with amounts significantly different from the average (${avg.toFixed(2)})`,
        severity: anomalousTransactions.length > 5 ? 'high' : 'medium',
        confidence: 0.85,
        data: {
          anomalousCount: anomalousTransactions.length,
          averageAmount: avg,
          standardDeviation: stdDev,
          transactions: anomalousTransactions.slice(0, 5).map(t => t.id)
        },
        actionable: true,
        recommendations: [
          'Review flagged transactions for potential fraud',
          'Verify merchant and customer information',
          'Consider implementing additional verification steps'
        ]
      });
    }

    // Detect unusual failure rates
    const failureRate = transactions.filter(t => t.status === 'failed').length / transactions.length;
    if (failureRate > 0.1) { // More than 10% failure rate
      insights.push({
        type: 'anomaly',
        title: 'High Transaction Failure Rate',
        description: `Transaction failure rate is ${(failureRate * 100).toFixed(2)}%, which is above the healthy threshold`,
        severity: failureRate > 0.2 ? 'critical' : 'high',
        confidence: 0.92,
        data: {
          failureRate: failureRate,
          failedCount: transactions.filter(t => t.status === 'failed').length,
          totalCount: transactions.length
        },
        actionable: true,
        recommendations: [
          'Investigate payment gateway issues',
          'Check for network connectivity problems',
          'Review declined reasons with payment processor'
        ]
      });
    }

    return insights;
  }

  /**
   * Analyze trends in transaction data
   */
  async analyzeTrends(transactions) {
    const insights = [];

    // Group transactions by time periods
    const hourlyTransactions = this.groupByHour(transactions);
    
    // Identify peak hours
    const peakHours = Object.entries(hourlyTransactions)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 3);

    if (peakHours.length > 0) {
      insights.push({
        type: 'trend',
        title: 'Peak Transaction Hours Identified',
        description: `Highest transaction volumes occur during specific hours, with peak at ${peakHours[0][0]}:00`,
        severity: 'low',
        confidence: 0.88,
        data: {
          peakHours: peakHours.map(([hour, txns]) => ({
            hour: parseInt(hour),
            count: txns.length,
            volume: txns.reduce((sum, t) => sum + t.amount, 0)
          }))
        },
        actionable: true,
        recommendations: [
          'Ensure sufficient server capacity during peak hours',
          'Schedule maintenance during off-peak hours',
          'Consider dynamic resource allocation'
        ]
      });
    }

    // Analyze card type distribution
    const cardTypeDistribution = this.groupBy(transactions, 'cardType');
    const dominantCardType = Object.entries(cardTypeDistribution)
      .sort((a, b) => b[1].length - a[1].length)[0];

    if (dominantCardType && dominantCardType[1].length / transactions.length > 0.5) {
      insights.push({
        type: 'trend',
        title: 'Card Type Usage Pattern',
        description: `${dominantCardType[0]} cards represent ${((dominantCardType[1].length / transactions.length) * 100).toFixed(1)}% of all transactions`,
        severity: 'low',
        confidence: 0.95,
        data: {
          distribution: Object.entries(cardTypeDistribution).map(([type, txns]) => ({
            type,
            count: txns.length,
            percentage: (txns.length / transactions.length * 100).toFixed(1)
          }))
        },
        actionable: false,
        recommendations: []
      });
    }

    return insights;
  }

  /**
   * Generate predictive insights
   */
  async generatePredictions(transactions) {
    const insights = [];

    if (transactions.length < 10) {
      return insights; // Need sufficient data for predictions
    }

    // Simple linear trend prediction
    const recentTransactions = transactions.slice(-7); // Last 7 transactions
    const avgRecentAmount = recentTransactions.reduce((sum, t) => sum + t.amount, 0) / recentTransactions.length;
    const avgHistoricalAmount = transactions.slice(0, -7).reduce((sum, t) => sum + t.amount, 0) / (transactions.length - 7);

    const growthRate = (avgRecentAmount - avgHistoricalAmount) / avgHistoricalAmount;

    if (Math.abs(growthRate) > 0.1) { // 10% change
      insights.push({
        type: 'prediction',
        title: growthRate > 0 ? 'Transaction Volume Growth Expected' : 'Transaction Volume Decline Expected',
        description: `Based on recent patterns, transaction amounts are ${growthRate > 0 ? 'increasing' : 'decreasing'} by approximately ${(Math.abs(growthRate) * 100).toFixed(1)}%`,
        severity: 'medium',
        confidence: 0.75,
        data: {
          growthRate: growthRate,
          predictedNextAmount: avgRecentAmount * (1 + growthRate),
          currentAverage: avgRecentAmount
        },
        actionable: true,
        recommendations: [
          growthRate > 0 ? 'Prepare for increased transaction volumes' : 'Investigate reasons for declining transactions',
          'Review business strategy and marketing campaigns',
          'Monitor customer behavior patterns'
        ]
      });
    }

    return insights;
  }

  /**
   * Process natural language query about payment data
   */
  async processNaturalLanguageQuery(query, reportData) {
    // Simplified NLP processing - in production, this would use an actual LLM
    const queryLower = query.toLowerCase();
    
    const responses = {
      'total': `Total transaction amount is ${reportData.summary.totalAmount}`,
      'average': `Average transaction amount is ${reportData.summary.averageAmount.toFixed(2)}`,
      'failed': `There are ${reportData.summary.failedTransactions} failed transactions`,
      'successful': `There are ${reportData.summary.successfulTransactions} successful transactions`,
      'count': `There are ${reportData.summary.totalTransactions} total transactions`
    };

    for (const [key, response] of Object.entries(responses)) {
      if (queryLower.includes(key)) {
        return response;
      }
    }

    return 'I can help you analyze transaction data. Try asking about totals, averages, or transaction counts.';
  }

  /**
   * Group transactions by hour
   */
  groupByHour(transactions) {
    return transactions.reduce((groups, txn) => {
      const hour = new Date(txn.timestamp).getHours();
      if (!groups[hour]) {
        groups[hour] = [];
      }
      groups[hour].push(txn);
      return groups;
    }, {});
  }

  /**
   * Group transactions by a specific field
   */
  groupBy(transactions, field) {
    return transactions.reduce((groups, txn) => {
      const key = txn[field] || 'unknown';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(txn);
      return groups;
    }, {});
  }
}

module.exports = new AIService();
