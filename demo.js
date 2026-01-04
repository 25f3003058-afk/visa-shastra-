#!/usr/bin/env node

/**
 * Demo script to populate the AI-Powered Reporting Platform with sample data
 * This script creates sample reports and generates insights for demonstration
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Sample report data generator
function generateSampleReport(title, transactionCount = 50) {
  const transactions = [];
  const merchants = ['Amazon', 'Walmart', 'Target', 'Best Buy', 'Apple Store', 'Costco', 'Starbucks', 'Home Depot'];
  const cardTypes = ['visa', 'mastercard', 'amex', 'discover'];
  const statuses = ['success', 'success', 'success', 'success', 'failed']; // 80% success rate
  const types = ['purchase', 'purchase', 'purchase', 'refund'];

  for (let i = 0; i < transactionCount; i++) {
    const amount = Math.random() < 0.05 
      ? Math.random() * 5000 + 1000 // 5% high-value transactions
      : Math.random() * 500 + 10;    // 95% normal transactions

    const timestamp = new Date();
    timestamp.setHours(timestamp.getHours() - Math.floor(Math.random() * 24 * 7)); // Random time in last week

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
    title: title,
    type: 'transaction',
    period: {
      start: weekAgo,
      end: now
    },
    transactions: transactions,
    status: 'active',
    metadata: {
      generatedBy: 'demo-script',
      dataSource: 'sample-data'
    }
  };
}

async function createReport(reportData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/reports`, reportData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating report:', error.message);
    return null;
  }
}

async function generateInsights(reportId) {
  try {
    const response = await axios.post(`${API_BASE_URL}/insights/generate/${reportId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error generating insights:', error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting AI-Powered Reporting Platform Demo\n');

  // Create sample reports
  const reportTitles = [
    'Q4 2024 Payment Report',
    'December 2024 Transaction Summary',
    'Weekly Payment Analysis - Week 1',
    'Holiday Season Sales Report'
  ];

  const createdReports = [];

  for (const title of reportTitles) {
    console.log(`📊 Creating report: ${title}...`);
    const reportData = generateSampleReport(title, 50);
    const report = await createReport(reportData);
    
    if (report) {
      console.log(`✅ Created report ${report.id}`);
      console.log(`   - Total Transactions: ${report.summary.totalTransactions}`);
      console.log(`   - Total Amount: $${report.summary.totalAmount.toFixed(2)}`);
      console.log(`   - Success Rate: ${((report.summary.successfulTransactions / report.summary.totalTransactions) * 100).toFixed(1)}%\n`);
      
      createdReports.push(report);
      
      // Generate insights for the report
      console.log(`🤖 Generating AI insights for ${report.id}...`);
      const insights = await generateInsights(report.id);
      
      if (insights && insights.length > 0) {
        console.log(`✅ Generated ${insights.length} insights:`);
        insights.forEach(insight => {
          console.log(`   - [${insight.severity.toUpperCase()}] ${insight.title}`);
        });
        console.log('');
      }
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n✅ Demo setup complete!');
  console.log(`\n📈 Created ${createdReports.length} reports with sample data and AI insights`);
  console.log('\n🌐 Access the dashboard at: http://localhost:3000');
  console.log('📊 API documentation: http://localhost:5000');
}

// Run the demo
main().catch(error => {
  console.error('Error running demo:', error);
  process.exit(1);
});
