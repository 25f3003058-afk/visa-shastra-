const Insight = require('../models/Insight');
const aiService = require('../services/aiService');
const { reports } = require('./reportController');

// In-memory storage for insights
const insights = new Map();

/**
 * Generate AI insights for a report
 */
const generateInsights = async (req, res) => {
  try {
    const reportId = req.params.reportId;
    const report = reports.get(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    // Generate insights using AI service
    const aiInsights = await aiService.analyzeReport(report);

    // Convert to Insight objects and store
    const insightObjects = aiInsights.map(data => {
      const insight = new Insight({
        ...data,
        reportId: reportId
      });
      insights.set(insight.id, insight);
      return insight;
    });

    res.json({
      success: true,
      count: insightObjects.length,
      data: insightObjects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get all insights for a report
 */
const getInsightsByReport = async (req, res) => {
  try {
    const reportId = req.params.reportId;
    const reportInsights = Array.from(insights.values())
      .filter(insight => insight.reportId === reportId);

    res.json({
      success: true,
      count: reportInsights.length,
      data: reportInsights
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get a single insight by ID
 */
const getInsightById = async (req, res) => {
  try {
    const insight = insights.get(req.params.id);

    if (!insight) {
      return res.status(404).json({
        success: false,
        error: 'Insight not found'
      });
    }

    res.json({
      success: true,
      data: insight
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Process natural language query
 */
const processQuery = async (req, res) => {
  try {
    const { query, reportId } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }

    const report = reports.get(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    const response = await aiService.processNaturalLanguageQuery(query, report);

    res.json({
      success: true,
      data: {
        query: query,
        response: response
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  generateInsights,
  getInsightsByReport,
  getInsightById,
  processQuery
};
