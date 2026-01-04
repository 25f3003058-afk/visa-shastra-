const { reports } = require('./reportController');

/**
 * Get analytics overview
 */
const getAnalyticsOverview = async (req, res) => {
  try {
    const allReports = Array.from(reports.values());
    
    const totalReports = allReports.length;
    const totalTransactions = allReports.reduce((sum, r) => sum + r.transactions.length, 0);
    const totalAmount = allReports.reduce((sum, r) => sum + r.summary.totalAmount, 0);
    
    const activeReports = allReports.filter(r => r.status === 'active').length;
    
    res.json({
      success: true,
      data: {
        totalReports,
        activeReports,
        totalTransactions,
        totalAmount,
        averageTransactionValue: totalTransactions > 0 ? totalAmount / totalTransactions : 0,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get time-series analytics
 */
const getTimeSeriesAnalytics = async (req, res) => {
  try {
    const reportId = req.params.reportId;
    const report = reports.get(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    // Group transactions by date
    const transactionsByDate = report.transactions.reduce((acc, txn) => {
      const date = new Date(txn.timestamp).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          count: 0,
          totalAmount: 0,
          successCount: 0,
          failedCount: 0
        };
      }
      acc[date].count++;
      acc[date].totalAmount += txn.amount;
      if (txn.status === 'success') acc[date].successCount++;
      if (txn.status === 'failed') acc[date].failedCount++;
      return acc;
    }, {});

    const timeSeries = Object.values(transactionsByDate).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    res.json({
      success: true,
      data: timeSeries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get merchant analytics
 */
const getMerchantAnalytics = async (req, res) => {
  try {
    const reportId = req.params.reportId;
    const report = reports.get(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    // Group by merchant
    const merchantStats = report.transactions.reduce((acc, txn) => {
      const merchant = txn.merchant || 'Unknown';
      if (!acc[merchant]) {
        acc[merchant] = {
          merchant,
          transactionCount: 0,
          totalAmount: 0,
          successCount: 0,
          failedCount: 0
        };
      }
      acc[merchant].transactionCount++;
      acc[merchant].totalAmount += txn.amount;
      if (txn.status === 'success') acc[merchant].successCount++;
      if (txn.status === 'failed') acc[merchant].failedCount++;
      return acc;
    }, {});

    const merchantAnalytics = Object.values(merchantStats)
      .sort((a, b) => b.totalAmount - a.totalAmount);

    res.json({
      success: true,
      data: merchantAnalytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get card type distribution
 */
const getCardTypeDistribution = async (req, res) => {
  try {
    const reportId = req.params.reportId;
    const report = reports.get(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    const cardTypeStats = report.transactions.reduce((acc, txn) => {
      const cardType = txn.cardType || 'Unknown';
      if (!acc[cardType]) {
        acc[cardType] = {
          cardType,
          count: 0,
          totalAmount: 0
        };
      }
      acc[cardType].count++;
      acc[cardType].totalAmount += txn.amount;
      return acc;
    }, {});

    const distribution = Object.values(cardTypeStats).map(stat => ({
      ...stat,
      percentage: (stat.count / report.transactions.length * 100).toFixed(2)
    }));

    res.json({
      success: true,
      data: distribution
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAnalyticsOverview,
  getTimeSeriesAnalytics,
  getMerchantAnalytics,
  getCardTypeDistribution
};
