# AdiCart Deployment Guide

## 🚀 Quick Start - Local Development

```bash
cd backend
npm install
npm start
# API runs at http://localhost:3000
```

## 📦 Docker Deployment

### Build Docker Image
```bash
docker build -t adicart:latest .
```

### Run Docker Container
```bash
docker-compose up -d
# API available at http://localhost:3000
```

## ☁️ Cloud Deployment Options

### 1. **Heroku** (Easiest for beginners)
```bash
heroku login
heroku create adicart-api
git push heroku main
# Live at: https://adicart-api.herokuapp.com
```

### 2. **Railway.app** (Recommended - Free tier)
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repo
3. Deploy automatically on push
4. Custom domain available

### 3. **DigitalOcean App Platform**
1. Connect GitHub repo
2. Auto-deploy on push
3. $5-12/month starting price

### 4. **AWS** (Scalable enterprise solution)
- **Option A:** Elastic Beanstalk (Managed)
  ```bash
  eb init
  eb create adicart-env
  eb deploy
  ```
- **Option B:** EC2 (Full control) + CloudFront CDN
- **Option C:** ECS/Fargate (Container orchestration)

### 5. **Google Cloud Run** (Serverless)
```bash
gcloud run deploy adicart --source .
```

### 6. **Azure** (Microsoft cloud)
1. App Service + Container Registry
2. CI/CD from GitHub

## 🔧 Environment Setup

Create `.env` in root directory:
```env
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://yourdomain.com
```

## 📊 API Endpoints

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product (admin)
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `POST /api/orders` - Place order
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status
- `GET /api/orders/:id/track` - Track order

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/users/:id` - Get user profile

### Payments
- `POST /api/payments` - Create payment
- `GET /api/payments/:id` - Get payment status
- `GET /api/payment-methods` - List payment methods

### Search & Categories
- `GET /api/search?q=query` - Search products
- `GET /api/categories` - List categories

### Health
- `GET /api/health` - Server status

## 🔐 Production Checklist

- [ ] Add JWT authentication
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS/SSL
- [ ] Set up database (MongoDB/PostgreSQL)
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Enable logging & monitoring
- [ ] Set up automated backups
- [ ] Configure CDN for static files
- [ ] Add API documentation (Swagger/OpenAPI)

## 📝 Next Steps

1. **Add Database:** Replace in-memory storage with MongoDB
2. **Authentication:** Implement JWT tokens
3. **Payment Gateway:** Integrate Stripe/Razorpay
4. **Email Service:** Add order confirmation emails
5. **Analytics:** Track user behavior & sales

## 🆘 Troubleshooting

### Port already in use
```bash
lsof -i :3000
kill -9 <PID>
```

### Webpack build fails
```bash
cd backend
npm install
npm start
```

### CORS errors
Update `CORS_ORIGIN` in `.env` to match frontend domain

### Database connection fails
Check connection string in environment variables

## 📞 Support

For issues, create a GitHub issue with:
- Error message & logs
- Reproduction steps
- Environment details
