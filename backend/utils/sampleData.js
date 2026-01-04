/**
 * Sample data generator for testing the AI-powered reporting platform
 */

const Transaction = require('../models/Transaction');

/**
 * Generate random transactions
 */
function generateSampleTransactions(count = 50) {
  const transactions = [];
  const merchants = ['Amazon', 'Walmart', 'Target', 'Best Buy', 'Apple Store', 'Costco', 'Starbucks'];
  const cardTypes = ['visa', 'mastercard', 'amex', 'discover'];
  const statuses = ['success', 'success', 'success', 'success', 'failed']; // 80% success rate
  const types = ['purchase', 'purchase', 'purchase', 'refund'];

  for (let i = 0; i < count; i++) {
    const amount = Math.random() < 0.05 
      ? Math.random() * 5000 + 1000 // 5% high-value transactions
      : Math.random() * 500 + 10;    // 95% normal transactions

    const timestamp = new Date();
    timestamp.setHours(timestamp.getHours() - Math.floor(Math.random() * 24 * 7)); // Random time in last week

    const transaction = new Transaction({
      amount: parseFloat(amount.toFixed(2)),
      currency: 'USD',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      type: types[Math.floor(Math.random() * types.length)],
      merchant: merchants[Math.floor(Math.random() * merchants.length)],
      customer: `customer${Math.floor(Math.random() * 1000)}@example.com`,
      cardType: cardTypes[Math.floor(Math.random() * cardTypes.length)],
      timestamp: timestamp,
      metadata: {
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0'
      }
    });

    transactions.push(transaction);
  }

  return transactions;
}

/**
 * Generate a sample report
 */
function generateSampleReport(title, type = 'transaction') {
  const transactions = generateSampleTransactions(50);
  
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return {
    title: title,
    type: type,
    period: {
      start: weekAgo,
      end: now
    },
    transactions: transactions,
    status: 'active',
    metadata: {
      generatedBy: 'system',
      dataSource: 'payment-gateway'
    }
  };
}

module.exports = {
  generateSampleTransactions,
  generateSampleReport
};
