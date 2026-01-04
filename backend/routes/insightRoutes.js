const express = require('express');
const router = express.Router();
const {
  generateInsights,
  getInsightsByReport,
  getInsightById,
  processQuery
} = require('../controllers/insightController');

/**
 * @route   POST /api/insights/generate/:reportId
 * @desc    Generate AI insights for a report
 * @access  Public
 */
router.post('/generate/:reportId', generateInsights);

/**
 * @route   GET /api/insights/report/:reportId
 * @desc    Get all insights for a report
 * @access  Public
 */
router.get('/report/:reportId', getInsightsByReport);

/**
 * @route   GET /api/insights/:id
 * @desc    Get insight by ID
 * @access  Public
 */
router.get('/:id', getInsightById);

/**
 * @route   POST /api/insights/query
 * @desc    Process natural language query
 * @access  Public
 */
router.post('/query', processQuery);

module.exports = router;
