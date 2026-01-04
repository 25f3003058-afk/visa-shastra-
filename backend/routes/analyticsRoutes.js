const express = require('express');
const router = express.Router();
const {
  getAnalyticsOverview,
  getTimeSeriesAnalytics,
  getMerchantAnalytics,
  getCardTypeDistribution
} = require('../controllers/analyticsController');

/**
 * @route   GET /api/analytics/overview
 * @desc    Get analytics overview
 * @access  Public
 */
router.get('/overview', getAnalyticsOverview);

/**
 * @route   GET /api/analytics/timeseries/:reportId
 * @desc    Get time-series analytics for a report
 * @access  Public
 */
router.get('/timeseries/:reportId', getTimeSeriesAnalytics);

/**
 * @route   GET /api/analytics/merchants/:reportId
 * @desc    Get merchant analytics for a report
 * @access  Public
 */
router.get('/merchants/:reportId', getMerchantAnalytics);

/**
 * @route   GET /api/analytics/cardtypes/:reportId
 * @desc    Get card type distribution for a report
 * @access  Public
 */
router.get('/cardtypes/:reportId', getCardTypeDistribution);

module.exports = router;
