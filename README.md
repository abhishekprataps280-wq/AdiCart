# AdiCart - E-Commerce API & Frontend

A full-featured e-commerce platform API built with Node.js + Express, similar to Amazon and Flipkart.

## 🚀 Quick Start

### Local Development
```bash
cd backend
npm install
npm start
# API runs at http://localhost:3000
```

### Docker
```bash
docker-compose up -d
# API available at http://localhost:3000
```

## 📦 Features

✅ Product Management (CRUD)  
✅ Shopping Cart & Orders  
✅ Payment Gateway Integration Ready  
✅ Order Tracking & Shipment  
✅ User Authentication  
✅ Search & Filter  
✅ Multi-language Support (Hindi)  
✅ Bilingual Product Names  

## 🛣️ API Endpoints

### Products
```
GET    /api/products              - List all products
GET    /api/products?category=X   - Filter by category
GET    /api/products?search=X     - Search products
GET    /api/products/:id          - Get product details
POST   /api/products              - Add product (admin)
PUT    /api/products/:id          - Update product
DELETE /api/products/:id          - Delete product
```

### Orders
```
GET    /api/orders                - List all orders
GET    /api/orders/:id            - Get order details
POST   /api/orders                - Place new order
PATCH  /api/orders/:id/status     - Update order status
GET    /api/orders/:id/track      - Track order
```

### Authentication
```
POST   /api/auth/register         - Register new user
POST   /api/auth/login            - Login user
GET    /api/users/:id             - Get user profile
```

### Payments
```
POST   /api/payments              - Create payment
GET    /api/payments/:id          - Get payment status
GET    /api/payment-methods       - List payment methods
```

### Categories & Search
```
GET    /api/categories            - List all categories
GET    /api/search?q=query        - Search products
```

### Health
```
GET    /api/health                - Server status
```

## 📂 Project Structure

```
AdiCart/
├── backend/
│   ├── server.js              # Express API server
│   ├── package.json           # Dependencies
│   └── node_modules/          # Installed packages
├── index.html                 # Frontend
├── script.js                  # Frontend logic
├── styles.css                 # Styling
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Docker Compose setup
├── Procfile                   # Heroku deployment
├── .env.example               # Environment template
└── README.md                  # This file
```

## 🌍 Deployment

### Heroku
```bash
heroku login
heroku create adicart-api
git push heroku main
```

### Railway.app
1. Connect GitHub repo
2. Auto-deploys on push
3. Free tier available

### Docker
```bash
docker build -t adicart .
docker run -p 3000:3000 adicart
```

### AWS / DigitalOcean / Google Cloud
See deployment instructions in your cloud provider dashboard

## 📊 Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** HTML5 + CSS3 + Vanilla JavaScript
- **Deployment:** Docker + GitHub Actions
- **Languages:** JavaScript (37.5%), TypeScript (25.3%), HTML (20.5%), CSS (16.7%)

## 🔐 Security Notes

⚠️ **Current Version (Development):**
- Passwords stored in plain text (for demo only)
- In-memory data store (resets on restart)
- No authentication tokens

✅ **Production Checklist:**
- [ ] Hash passwords with bcrypt
- [ ] Use JWT for authentication
- [ ] Move to MongoDB/PostgreSQL
- [ ] Enable HTTPS/SSL
- [ ] Set up rate limiting
- [ ] Add CORS whitelist
- [ ] Configure environment variables
- [ ] Add request validation
- [ ] Implement logging
- [ ] Set up monitoring

## 📝 Next Steps

1. **Add Database:** MongoDB or PostgreSQL
2. **Payment Integration:** Stripe/Razorpay
3. **Email Service:** SendGrid or Nodemailer
4. **Admin Dashboard:** Management panel
5. **Mobile App:** React Native or Flutter
6. **Analytics:** Sales tracking & reports

## 📞 Support

For issues, create a [GitHub Issue](https://github.com/abhishekprataps280-wq/AdiCart/issues)

## 📄 License

MIT License - feel free to use this project

---

**Deploy Now:** Choose your platform above and go live! 🎉
