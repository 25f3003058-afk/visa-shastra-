# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, the API is open for development. In production, implement JWT authentication.

## Endpoints

### Health Check

#### GET /health
Check if the API is running

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-04T12:00:00.000Z",
  "uptime": 3600
}
```

---

## Reports

### Get All Reports

#### GET /api/reports
Retrieve all payment reports

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "RPT-1234567890-abc123",
      "title": "Q4 2024 Payment Report",
      "type": "transaction",
      "period": {
        "start": "2024-10-01T00:00:00.000Z",
        "end": "2024-12-31T23:59:59.999Z"
      },
      "summary": {
        "totalTransactions": 50,
        "totalAmount": 12500.50,
        "successfulTransactions": 45,
        "failedTransactions": 5,
        "averageAmount": 250.01
      },
      "status": "active",
      "createdAt": "2024-01-04T12:00:00.000Z",
      "updatedAt": "2024-01-04T12:00:00.000Z"
    }
  ]
}
```

### Get Report by ID

#### GET /api/reports/:id
Retrieve a specific report

**Parameters:**
- `id` (path): Report ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "RPT-1234567890-abc123",
    "title": "Q4 2024 Payment Report",
    "transactions": [...],
    "summary": {...}
  }
}
```

### Create Report

#### POST /api/reports
Create a new payment report

**Request Body:**
```json
{
  "title": "Q4 2024 Payment Report",
  "type": "transaction",
  "period": {
    "start": "2024-10-01T00:00:00.000Z",
    "end": "2024-12-31T23:59:59.999Z"
  },
  "transactions": [
    {
      "amount": 100.50,
      "currency": "USD",
      "status": "success",
      "type": "purchase",
      "merchant": "Amazon",
      "customer": "customer@example.com",
      "cardType": "visa",
      "timestamp": "2024-12-01T10:30:00.000Z"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "RPT-1234567890-abc123",
    "title": "Q4 2024 Payment Report",
    ...
  }
}
```

### Update Report

#### PUT /api/reports/:id
Update an existing report

**Parameters:**
- `id` (path): Report ID

**Request Body:** (partial update supported)
```json
{
  "title": "Updated Report Title",
  "status": "archived"
}
```

### Delete Report

#### DELETE /api/reports/:id
Delete a report

**Parameters:**
- `id` (path): Report ID

**Response:**
```json
{
  "success": true,
  "message": "Report deleted successfully"
}
```

### Get Report Summary

#### GET /api/reports/:id/summary
Get summary statistics for a report

**Parameters:**
- `id` (path): Report ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "RPT-1234567890-abc123",
    "title": "Q4 2024 Payment Report",
    "summary": {
      "totalTransactions": 50,
      "totalAmount": 12500.50,
      "successfulTransactions": 45,
      "failedTransactions": 5
    },
    "period": {
      "start": "2024-10-01T00:00:00.000Z",
      "end": "2024-12-31T23:59:59.999Z"
    }
  }
}
```

---

## Insights

### Generate Insights

#### POST /api/insights/generate/:reportId
Generate AI-powered insights for a report

**Parameters:**
- `reportId` (path): Report ID

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "INS-1234567890-xyz789",
      "reportId": "RPT-1234567890-abc123",
      "type": "anomaly",
      "title": "Unusual Transaction Amounts Detected",
      "description": "Found 5 transactions with amounts significantly different from the average (250.01)",
      "severity": "high",
      "confidence": 0.85,
      "data": {
        "anomalousCount": 5,
        "averageAmount": 250.01,
        "standardDeviation": 50.23
      },
      "actionable": true,
      "recommendations": [
        "Review flagged transactions for potential fraud",
        "Verify merchant and customer information"
      ],
      "createdAt": "2024-01-04T12:00:00.000Z"
    }
  ]
}
```

### Get Insights by Report

#### GET /api/insights/report/:reportId
Get all insights for a specific report

**Parameters:**
- `reportId` (path): Report ID

### Get Insight by ID

#### GET /api/insights/:id
Get a specific insight

**Parameters:**
- `id` (path): Insight ID

### Process Natural Language Query

#### POST /api/insights/query
Ask questions about report data in natural language

**Request Body:**
```json
{
  "query": "What is the total transaction amount?",
  "reportId": "RPT-1234567890-abc123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "query": "What is the total transaction amount?",
    "response": "Total transaction amount is 12500.50"
  }
}
```

---

## Analytics

### Get Analytics Overview

#### GET /api/analytics/overview
Get platform-wide analytics overview

**Response:**
```json
{
  "success": true,
  "data": {
    "totalReports": 10,
    "activeReports": 8,
    "totalTransactions": 500,
    "totalAmount": 125000.50,
    "averageTransactionValue": 250.00,
    "timestamp": "2024-01-04T12:00:00.000Z"
  }
}
```

### Get Time Series Analytics

#### GET /api/analytics/timeseries/:reportId
Get time-series data for a report

**Parameters:**
- `reportId` (path): Report ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-01",
      "count": 25,
      "totalAmount": 5000.00,
      "successCount": 23,
      "failedCount": 2
    },
    {
      "date": "2024-01-02",
      "count": 30,
      "totalAmount": 6500.00,
      "successCount": 28,
      "failedCount": 2
    }
  ]
}
```

### Get Merchant Analytics

#### GET /api/analytics/merchants/:reportId
Get merchant performance analytics

**Parameters:**
- `reportId` (path): Report ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "merchant": "Amazon",
      "transactionCount": 50,
      "totalAmount": 10000.00,
      "successCount": 48,
      "failedCount": 2
    },
    {
      "merchant": "Walmart",
      "transactionCount": 30,
      "totalAmount": 5000.00,
      "successCount": 29,
      "failedCount": 1
    }
  ]
}
```

### Get Card Type Distribution

#### GET /api/analytics/cardtypes/:reportId
Get card type distribution for a report

**Parameters:**
- `reportId` (path): Report ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "cardType": "visa",
      "count": 50,
      "totalAmount": 12000.00,
      "percentage": "50.00"
    },
    {
      "cardType": "mastercard",
      "count": 30,
      "totalAmount": 7500.00,
      "percentage": "30.00"
    }
  ]
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

---

## Rate Limiting
- 100 requests per 15 minutes per IP address
- Returns `429 Too Many Requests` when limit exceeded

## CORS
Cross-origin requests are allowed from the configured origin (default: `http://localhost:3000`)
