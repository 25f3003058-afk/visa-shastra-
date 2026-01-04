# Deployment Guide

## 🚀 Production Deployment Guide

This guide covers deploying the AI-Powered Reporting Platform to production.

---

## Pre-Deployment Checklist

### Code Preparation

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Backup strategy in place

### Infrastructure Requirements

**Backend:**
- Node.js 14+ runtime
- 512MB RAM minimum (2GB recommended)
- 1 CPU core minimum (2+ recommended)
- 10GB storage minimum

**Frontend:**
- Static file hosting
- CDN recommended
- HTTPS required

**Database (Optional):**
- MongoDB 4.4+ or PostgreSQL 12+
- Separate instance recommended
- Backup solution configured

---

## Deployment Options

### Option 1: AWS Deployment

#### Backend on EC2

**1. Launch EC2 Instance**
```bash
# Amazon Linux 2 or Ubuntu 20.04 LTS
# t3.small or larger recommended
```

**2. Install Dependencies**
```bash
sudo yum update -y
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs git
```

**3. Deploy Application**
```bash
git clone https://github.com/your-org/visa-shastra-.git
cd visa-shastra-
npm install --production
```

**4. Configure Environment**
```bash
cp .env.example .env
nano .env
# Set production values
```

**5. Setup Process Manager**
```bash
sudo npm install -g pm2
pm2 start backend/server.js --name reporting-api
pm2 startup
pm2 save
```

**6. Configure Nginx**
```nginx
server {
    listen 80;
    server_name api.yourcompany.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**7. Setup SSL**
```bash
sudo yum install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourcompany.com
```

#### Frontend on S3 + CloudFront

**1. Build Frontend**
```bash
cd frontend
npm install
npm run build
```

**2. Create S3 Bucket**
```bash
aws s3 mb s3://reporting-platform-frontend
aws s3 sync build/ s3://reporting-platform-frontend
```

**3. Configure S3 for Static Hosting**
- Enable static website hosting
- Set index.html as index document
- Configure bucket policy for public read

**4. Setup CloudFront**
- Create distribution
- Set S3 bucket as origin
- Configure SSL certificate
- Enable compression
- Set cache behaviors

**5. Update DNS**
- Point domain to CloudFront distribution
- Verify SSL certificate

#### Database on RDS or DocumentDB

**For PostgreSQL (RDS):**
```bash
# Create RDS instance
# Configure security groups
# Update DATABASE_URL in .env
```

**For MongoDB (DocumentDB):**
```bash
# Create DocumentDB cluster
# Configure VPC security groups
# Update MONGODB_URI in .env
```

---

### Option 2: Heroku Deployment

#### Backend

**1. Install Heroku CLI**
```bash
npm install -g heroku
heroku login
```

**2. Create Heroku App**
```bash
heroku create reporting-platform-api
```

**3. Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=5000
heroku config:set CORS_ORIGIN=https://your-frontend-domain.com
```

**4. Create Procfile**
```
web: node backend/server.js
```

**5. Deploy**
```bash
git push heroku main
heroku open
```

#### Frontend on Netlify

**1. Install Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
```

**2. Build and Deploy**
```bash
cd frontend
npm run build
netlify deploy --prod --dir=build
```

**3. Configure Environment**
- Set REACT_APP_API_URL in Netlify dashboard
- Configure redirects for SPA routing

---

### Option 3: DigitalOcean

#### Using App Platform

**1. Connect Repository**
- Link GitHub repository
- Select branch

**2. Configure Backend**
- Set build command: `npm install`
- Set run command: `node backend/server.js`
- Set environment variables

**3. Configure Frontend**
- Set build command: `cd frontend && npm install && npm run build`
- Set output directory: `frontend/build`
- Configure environment variables

**4. Deploy**
- Click "Create Resources"
- Wait for deployment
- Configure custom domains

---

### Option 4: Docker Deployment

#### Backend Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY backend ./backend

EXPOSE 5000

CMD ["node", "backend/server.js"]
```

#### Frontend Dockerfile

```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGODB_URI=mongodb://mongo:27017/reporting
    depends_on:
      - mongo
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_URL=http://backend:5000
    depends_on:
      - backend
    restart: unless-stopped

  mongo:
    image: mongo:5
    volumes:
      - mongo-data:/data/db
    restart: unless-stopped

volumes:
  mongo-data:
```

#### Deploy with Docker

```bash
docker-compose up -d
```

---

## Post-Deployment Configuration

### 1. Environment Variables

**Backend (.env):**
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-database-url
JWT_SECRET=your-secure-secret-key
OPENAI_API_KEY=your-openai-key
CORS_ORIGIN=https://your-frontend-domain.com
```

**Frontend:**
```bash
REACT_APP_API_URL=https://api.yourcompany.com
```

### 2. Database Setup

**MongoDB Initialization:**
```javascript
// Create indexes
db.reports.createIndex({ createdAt: -1 });
db.reports.createIndex({ status: 1 });
db.transactions.createIndex({ reportId: 1 });
db.insights.createIndex({ reportId: 1 });
```

**PostgreSQL Schema:**
```sql
CREATE TABLE reports (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data JSONB
);

CREATE TABLE transactions (
    id VARCHAR(50) PRIMARY KEY,
    report_id VARCHAR(50) REFERENCES reports(id),
    amount DECIMAL(10, 2),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data JSONB
);

CREATE TABLE insights (
    id VARCHAR(50) PRIMARY KEY,
    report_id VARCHAR(50) REFERENCES reports(id),
    type VARCHAR(50),
    severity VARCHAR(50),
    confidence DECIMAL(3, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data JSONB
);
```

### 3. Security Hardening

**API Security:**
```javascript
// Update rate limits for production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000 // Higher limit for production
});

// Add authentication middleware
app.use('/api', authMiddleware);

// Enable HTTPS redirect
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

**Database Security:**
- Enable authentication
- Use strong passwords
- Restrict network access
- Enable encryption at rest
- Regular backups

### 4. Monitoring Setup

**Application Monitoring:**
```bash
# Install monitoring agent
npm install --save newrelic
# or
npm install --save @datadog/datadog-agent
```

**Log Management:**
```javascript
// Use production logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

**Health Checks:**
```javascript
// Enhanced health check
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    database: await checkDatabaseConnection(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage()
  };
  res.json(health);
});
```

---

## Monitoring & Maintenance

### Monitoring Checklist

- [ ] Application performance monitoring (APM)
- [ ] Error tracking and alerting
- [ ] Log aggregation and analysis
- [ ] Uptime monitoring
- [ ] Database performance monitoring
- [ ] API endpoint monitoring
- [ ] SSL certificate expiry alerts
- [ ] Resource utilization tracking

### Maintenance Tasks

**Daily:**
- Check error logs
- Monitor system health
- Review API usage

**Weekly:**
- Review performance metrics
- Check for security updates
- Analyze user feedback
- Database maintenance

**Monthly:**
- Security audit
- Backup verification
- Dependency updates
- Performance optimization
- Cost analysis

---

## Rollback Procedure

**Quick Rollback:**
```bash
# For PM2
pm2 reload all --update-env

# For Docker
docker-compose down
docker-compose up -d --build

# For Heroku
heroku rollback
```

**Database Rollback:**
```bash
# Restore from backup
mongorestore --uri="mongodb://..." /path/to/backup

# Or for PostgreSQL
psql dbname < backup.sql
```

---

## Scaling Guidelines

### Horizontal Scaling

**Backend:**
- Multiple instances behind load balancer
- Session management with Redis
- Sticky sessions if needed

**Frontend:**
- CDN for global distribution
- Multiple edge locations
- Cache optimization

### Vertical Scaling

**When to Scale Up:**
- CPU usage > 70% consistently
- Memory usage > 80%
- Response times degrading
- Database connections maxed out

### Performance Optimization

**Backend:**
```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Cache frequently accessed data
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 });
```

**Frontend:**
```javascript
// Code splitting
const LazyComponent = React.lazy(() => import('./Component'));

// Memoization
const MemoizedComponent = React.memo(Component);
```

---

## Backup & Recovery

### Backup Strategy

**Database Backups:**
- Automated daily backups
- Retention: 30 days minimum
- Off-site storage
- Regular restore testing

**Application Backups:**
- Version control (Git)
- Tagged releases
- Configuration backups
- Deployment artifacts

### Recovery Procedures

**Disaster Recovery:**
1. Assess the situation
2. Activate backup systems
3. Restore from latest backup
4. Verify data integrity
5. Resume normal operations
6. Post-mortem analysis

---

## Support & Troubleshooting

### Common Issues

**Backend Not Starting:**
- Check environment variables
- Verify port availability
- Review error logs
- Check database connection

**Frontend Not Loading:**
- Verify API URL configuration
- Check CORS settings
- Review browser console
- Verify CDN/hosting status

**Database Connection Issues:**
- Check connection string
- Verify network access
- Check credentials
- Review firewall rules

### Getting Help

- Technical documentation
- Issue tracking system
- Development team contact
- Emergency procedures

---

## Conclusion

Following this deployment guide ensures a secure, scalable, and maintainable production deployment of the AI-Powered Reporting Platform. Regular monitoring and maintenance are key to long-term success.

For questions or issues, contact the development team or refer to the technical documentation.

---

**Last Updated:** January 2026
**Version:** 1.0.0
