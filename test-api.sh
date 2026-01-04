#!/bin/bash

# Test script for AI-Powered Reporting Platform
# Tests all major API endpoints and functionality

BASE_URL="http://localhost:5000"
API_URL="${BASE_URL}/api"

echo "🧪 Testing AI-Powered Reporting Platform API"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Test function
test_endpoint() {
    local name=$1
    local url=$2
    local method=${3:-GET}
    local data=${4:-""}
    
    echo -n "Testing: $name... "
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -X POST "$url" -H "Content-Type: application/json" -d "$data")
    else
        response=$(curl -s "$url")
    fi
    
    if echo "$response" | jq -e '.success == true' > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        echo "Response: $response"
        ((TESTS_FAILED++))
        return 1
    fi
}

# 1. Health Check
echo "📋 Basic Tests"
echo "-------------"
echo -n "Testing: Health Check... "
response=$(curl -s "${BASE_URL}/health")
if echo "$response" | jq -e '.status == "healthy"' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((TESTS_FAILED++))
fi
echo ""

# 2. Reports API
echo "📊 Reports API Tests"
echo "-------------------"
test_endpoint "Get All Reports" "${API_URL}/reports"

# Create a test report
TEST_REPORT_DATA='{
  "title": "Test Report",
  "type": "transaction",
  "period": {"start": "2024-01-01", "end": "2024-12-31"},
  "transactions": [
    {"amount": 100, "currency": "USD", "status": "success", "type": "purchase", "merchant": "Test", "customer": "test@example.com", "cardType": "visa", "timestamp": "2024-01-01T12:00:00Z"}
  ]
}'

if test_endpoint "Create Report" "${API_URL}/reports" "POST" "$TEST_REPORT_DATA"; then
    # Extract report ID from the last created report
    REPORT_ID=$(curl -s "${API_URL}/reports" | jq -r '.data[-1].id')
    echo "   Created Report ID: $REPORT_ID"
    
    test_endpoint "Get Report by ID" "${API_URL}/reports/$REPORT_ID"
    test_endpoint "Get Report Summary" "${API_URL}/reports/$REPORT_ID/summary"
fi
echo ""

# 3. Insights API
echo "🤖 Insights API Tests"
echo "--------------------"
if [ ! -z "$REPORT_ID" ]; then
    test_endpoint "Generate Insights" "${API_URL}/insights/generate/$REPORT_ID" "POST"
    test_endpoint "Get Insights by Report" "${API_URL}/insights/report/$REPORT_ID"
    
    QUERY_DATA='{"query": "What is the total?", "reportId": "'$REPORT_ID'"}'
    test_endpoint "Natural Language Query" "${API_URL}/insights/query" "POST" "$QUERY_DATA"
fi
echo ""

# 4. Analytics API
echo "📈 Analytics API Tests"
echo "---------------------"
test_endpoint "Analytics Overview" "${API_URL}/analytics/overview"

if [ ! -z "$REPORT_ID" ]; then
    test_endpoint "Time Series Analytics" "${API_URL}/analytics/timeseries/$REPORT_ID"
    test_endpoint "Merchant Analytics" "${API_URL}/analytics/merchants/$REPORT_ID"
    test_endpoint "Card Type Distribution" "${API_URL}/analytics/cardtypes/$REPORT_ID"
fi
echo ""

# 5. Error Handling Tests
echo "🛡️  Error Handling Tests"
echo "-----------------------"
echo -n "Testing: 404 Not Found... "
response=$(curl -s -w "%{http_code}" "${API_URL}/nonexistent")
if [[ "$response" == *"404"* ]]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((TESTS_FAILED++))
fi

echo -n "Testing: Invalid Report ID... "
response=$(curl -s "${API_URL}/reports/INVALID-ID")
if echo "$response" | jq -e '.success == false' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((TESTS_FAILED++))
fi
echo ""

# Summary
echo "=============================================="
echo "Test Summary"
echo "=============================================="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed!${NC}"
    exit 1
fi
