const express = require('express');
const router = express.Router();
const {
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  getReportSummary
} = require('../controllers/reportController');

/**
 * @route   GET /api/reports
 * @desc    Get all reports
 * @access  Public
 */
router.get('/', getAllReports);

/**
 * @route   GET /api/reports/:id
 * @desc    Get report by ID
 * @access  Public
 */
router.get('/:id', getReportById);

/**
 * @route   GET /api/reports/:id/summary
 * @desc    Get report summary
 * @access  Public
 */
router.get('/:id/summary', getReportSummary);

/**
 * @route   POST /api/reports
 * @desc    Create new report
 * @access  Public
 */
router.post('/', createReport);

/**
 * @route   PUT /api/reports/:id
 * @desc    Update report
 * @access  Public
 */
router.put('/:id', updateReport);

/**
 * @route   DELETE /api/reports/:id
 * @desc    Delete report
 * @access  Public
 */
router.delete('/:id', deleteReport);

module.exports = router;
