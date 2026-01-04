# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 14+ installed
- npm installed
- A terminal/command prompt

### Step 1: Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Start the Backend Server

Open a terminal and run:

```bash
npm start
```

You should see:
```
🚀 Server running on port 5000
📊 AI-Powered Reporting Platform API ready
🌐 Environment: development
```

Keep this terminal running.

### Step 3: Start the Frontend

Open a **new terminal** and run:

```bash
cd frontend
npm start
```

The React app will open automatically at `http://localhost:3000`

### Step 4: Explore the Platform

#### Option A: Manual Exploration

1. Click "Create New Report" on the dashboard
2. Fill in the form:
   - Title: "My First Report"
   - Type: "Transaction Report"
   - Transaction Count: 50
3. Click "Create Report"
4. Click on the created report to view details
5. Click "Generate AI Insights" to see AI analysis
6. Explore the different tabs: Overview, Insights, Analytics, Ask AI

#### Option B: Quick Demo with Sample Data

In a **third terminal**, run the demo script:

```bash
node demo.js
```

This will create 4 sample reports with AI insights. Then refresh your browser to see them!

## 🎯 Key Features to Try

### 1. Dashboard Overview
- View all reports at a glance
- See platform-wide statistics
- Quick access to individual reports

### 2. AI Insights
- Automatic anomaly detection
- Trend analysis
- Predictive insights
- Actionable recommendations

### 3. Analytics Charts
- Transaction trends over time
- Success vs failure rates
- Top merchants by volume
- Card type distribution
- Merchant performance table

### 4. Natural Language Queries
Try asking:
- "What is the total transaction amount?"
- "How many transactions failed?"
- "What is the average transaction amount?"
- "How many successful transactions are there?"

## 📝 Sample Use Cases

### Use Case 1: Identify Payment Issues
1. Create a report or select an existing one
2. Generate AI insights
3. Look for "High Transaction Failure Rate" alerts
4. Review the recommendations
5. Check the merchant analytics to identify problem merchants

### Use Case 2: Analyze Peak Hours
1. Open a report
2. Navigate to the "Analytics" tab
3. View the "Transaction Trends Over Time" chart
4. Check the AI insights for peak hour analysis
5. Plan server capacity accordingly

### Use Case 3: Monitor Card Type Performance
1. Open a report
2. Go to "Analytics" tab
3. View the "Card Type Distribution" pie chart
4. Check insights for card type trends
5. Optimize for most used card types

## 🔧 Troubleshooting

### Backend won't start
- Make sure port 5000 is not already in use
- Check that you ran `npm install` in the root directory
- Verify Node.js version: `node --version` (should be 14+)

### Frontend won't start
- Make sure port 3000 is not already in use
- Check that you ran `npm install` in the frontend directory
- Try deleting `frontend/node_modules` and running `npm install` again

### API errors
- Ensure the backend is running before starting the frontend
- Check the backend terminal for error messages
- Verify the API URL in `.env` (default: http://localhost:5000)

## 📚 Next Steps

1. **Read the Documentation**
   - README.md - Full project overview
   - API_DOCUMENTATION.md - Complete API reference
   - ARCHITECTURE.md - System architecture details

2. **Customize the Platform**
   - Modify AI algorithms in `backend/services/aiService.js`
   - Add new chart types in `frontend/src/components/AnalyticsCharts.js`
   - Create custom report types

3. **Connect Real Data**
   - Replace in-memory storage with MongoDB/PostgreSQL
   - Connect to your payment gateway API
   - Implement authentication

4. **Deploy to Production**
   - Set up environment variables
   - Build the frontend: `cd frontend && npm run build`
   - Deploy to AWS, Heroku, or your preferred platform

## 🎓 Learning Resources

### Understanding the Code

**Backend Structure:**
```
backend/
├── server.js          - Main Express app
├── models/           - Data models
├── controllers/      - Business logic
├── routes/          - API endpoints
├── services/        - AI/ML algorithms
└── utils/           - Helper functions
```

**Frontend Structure:**
```
frontend/src/
├── App.js           - Main component
├── pages/          - Page components
├── components/     - Reusable components
├── services/       - API client
└── styles/         - CSS styling
```

### Key Technologies
- **Backend**: Node.js, Express, Axios
- **Frontend**: React, Recharts
- **AI/ML**: Custom algorithms (statistical analysis)
- **Security**: Helmet, Rate Limiting, CORS

## 💡 Tips

1. **Create Realistic Data**: Use the CreateReportForm to generate reports with different transaction counts
2. **Compare Reports**: Create multiple reports and compare their insights
3. **Experiment with Queries**: The natural language query is simple but extensible
4. **Monitor Performance**: Check the analytics overview for platform-wide stats
5. **Review Insights**: AI insights include confidence scores and recommendations

## 🤝 Need Help?

- Check the API documentation for endpoint details
- Review the architecture guide for system design
- Look at the code comments for implementation details
- Create an issue on GitHub for bugs or feature requests

---

Happy Analyzing! 📊✨
