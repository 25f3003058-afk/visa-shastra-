const Report = require('../models/Report');
const aiService = require('../services/aiService');

// In-memory storage (replace with database in production)
const reports = new Map();

/**
 * Get all reports
 */
const getAllReports = async (req, res) => {
  try {
    const allReports = Array.from(reports.values());
    res.json({
      success: true,
      count: allReports.length,
      data: allReports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get a single report by ID
 */
const getReportById = async (req, res) => {
  try {
    const report = reports.get(req.params.id);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Create a new report
 */
const createReport = async (req, res) => {
  try {
    const report = new Report(req.body);
    report.updateSummary();
    
    reports.set(report.id, report);

    res.status(201).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Update a report
 */
const updateReport = async (req, res) => {
  try {
    const report = reports.get(req.params.id);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    // Update fields
    Object.assign(report, req.body);
    report.updatedAt = new Date();
    report.updateSummary();

    reports.set(report.id, report);

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Delete a report
 */
const deleteReport = async (req, res) => {
  try {
    const report = reports.get(req.params.id);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    reports.delete(req.params.id);

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get report summary statistics
 */
const getReportSummary = async (req, res) => {
  try {
    const report = reports.get(req.params.id);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: report.id,
        title: report.title,
        summary: report.summary,
        period: report.period
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
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  getReportSummary,
  reports // Export for use in other controllers
};
