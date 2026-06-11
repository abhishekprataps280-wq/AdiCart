/*
 * AdiCart Backend – Node.js + Express REST API
 * Run: node server.js
 */
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// CORS Configuration
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..')));

/* ── In-memory data store ── */
let products = [
  {id:1,name:"Samsung Galaxy S25 Ultra",nameHi:"Samsung Galaxy S25 Ultra",category:"electronics",price:89999,original:129999,rating:4.8,reviews:2847,discount:31,badge:"sale",emoji:"📱",stock:42},
  {id:2,name:"Apple AirPods Pro 3",nameHi:"Apple AirPods Pro 3",category:"electronics",price:24999,original:29999,rating:4.7,reviews:1923,discount:17,badge:"new",emoji:"🎧",stock:15},
  {id:3,name:"Sony 4K OLED TV 55\"",nameHi:"Sony 4K OLED TV 55\"",category:"electronics",price:89999,original:120000,rating:4.6,reviews:876,discount:25,badge:"sale",emoji:"📺",stock:8},
  {id:4,name:"Dell XPS 15 Laptop",nameHi:"Dell XPS 15 लैपटॉप",category:"electronics",price:119999,original:149999,rating:4.9,reviews:654,discount:20,badge:"hot",emoji:"💻",stock:23},
  {id:5,name:"Floral Summer Dress",nameHi:"फ्लोरल समर ड्रेस",category:"fashion",price:1299,original:2999,rating:4.5,reviews:3241,discount:57,badge:"sale",emoji:"👗",stock:156},
  {id:6,name:"Men's Slim Fit Blazer",nameHi:"मेन्स स्लिम फिट ब्लेजर",category:"fashion",price:2499,original:5999,rating:4.4,reviews:1567,discount:58,badge:"sale",emoji:"🧥",stock:89},
  {id:7,name:"Running Shoes Pro X",nameHi:"रनिंग शूज प्रो X",category:"fashion",price:3499,original:6999,rating:4.6,reviews:2109,discount:50,badge:"hot",emoji:"👟",stock:234},
  {id:8,name:"Designer Handbag",nameHi:"डिज़ाइनर हैंडबैग",category:"fashion",price:4999,original:12000,rating:4.3,reviews:876,discount:58,badge:"new",emoji:"👜",stock:45},
  {id:9,name:"Smart LED Desk Lamp",nameHi:"स्मार्ट LED डेस्क लैम्प",category:"home",price:1899,original:3499,rating:4.5,reviews:2341,discount:46,badge:"new",emoji:"💡",stock:187},
  {id:10,name:"Air Purifier HEPA",nameHi:"Air Purifier HEPA",category:"home",price:12999,original:19999,rating:4.7,reviews:1234,discount:35,badge:"sale",emoji:"🌬️",stock:18},
  {id:11,name:"Non-Stick Cookware Set",nameHi:"नॉन-स्टिक कुकवेयर सेट",category:"home",price:3999,original:7999,rating:4.6,reviews:3456,discount:50,badge:"hot",emoji:"🍳",stock:92},
  {id:12,name:"Memory Foam Pillow",nameHi:"मेमोरी फोम तकिया",category:"home",price:1499,original:2999,rating:4.4,reviews:987,discount:50,badge:"new",emoji:"🛏️",stock:203},
  {id:13,name:"Vitamin C Serum",nameHi:"विटामिन C सीरम",category:"beauty",price:699,original:1499,rating:4.6,reviews:5678,discount:53,badge:"hot",emoji:"✨",stock:300},
  {id:14,name:"Luxury Perfume Set",nameHi:"लग्जरी परफ्यूम सेट",category:"beauty",price:2999,original:5999,rating:4.5,reviews:1234,discount:50,badge:"sale",emoji:"🌸",stock:67},
  {id:15,name:"Hair Dryer Pro 2000W",nameHi:"हेयर ड्रायर प्रो 2000W",category:"beauty",price:2499,original:4999,rating:4.4,reviews:2109,discount:50,badge:"new",emoji:"💇",stock:134},
  {id:16,name:"Skincare Ritual Kit",nameHi:"स्किनकेयर रिचुअल किट",category:"beauty",price:1999,original:3999,rating:4.7,reviews:876,discount:50,badge:"hot",emoji:"🧴",stock:78}
];

let orders = [];
let users = [];
let nextOrderId = 1001;

const productMetadata = {
  1: {
    description: 'Latest flagship smartphone with 200MP camera, AI-powered video, and long battery life.',
    images: [
      'https://via.placeholder.com/600x600?text=Samsung+S25+Ultra+1',
      'https://via.placeholder.com/600x600?text=Samsung+S25+Ultra+2'
    ],
    seller: 'Samsung Official Store',
    sellerLocation: 'Noida, UP'
  },
  2: {
    description: 'Wireless noise-cancelling earbuds with spatial audio and adaptive transparency.',
    images: [
      'https://via.placeholder.com/600x600?text=AirPods+Pro+3+1',
      'https://via.placeholder.com/600x600?text=AirPods+Pro+3+2'
    ],
    seller: 'Apple Store',
    sellerLocation: 'Bengaluru, KA'
  },
  3: {
    description: '55-inch 4K OLED smart TV with Dolby Vision and voice assistant support.',
    images: [
      'https://via.placeholder.com/600x600?text=Sony+OLED+TV+1',
      'https://via.placeholder.com/600x600?text=Sony+OLED+TV+2'
    ],
    seller: 'Sony Electronics',
    sellerLocation: 'Mumbai, MH'
  },
  4: {
    description: 'High-performance laptop for professionals with premium build and fast processor.',
    images: [
      'https://via.placeholder.com/600x600?text=Dell+XPS+15+1',
      'https://via.placeholder.com/600x600?text=Dell+XPS+15+2'
    ],
    seller: 'Dell Official',
    sellerLocation: 'Pune, MH'
  },
  5: {
    description: 'Lightweight floral summer dress with breathable fabric and modern fit.',
    images: [
      'https://via.placeholder.com/600x600?text=Floral+Summer+Dress+1',
      'https://via.placeholder.com/600x600?text=Floral+Summer+Dress+2'
    ],
    seller: 'Fashion Hub',
    sellerLocation: 'Jaipur, RJ'
  },
  6: {
    description: 'Slim-fit blazer crafted for formal events and sharp everyday styling.',
    images: [
      'https://via.placeholder.com/600x600?text=Slim+Fit+Blazer+1',
      'https://via.placeholder.com/600x600?text=Slim+Fit+Blazer+2'
    ],
    seller: 'Urban Attire',
    sellerLocation: 'Chennai, TN'
  },
  7: {
    description: 'Professional running shoes with responsive cushioning and durable grip.',
    images: [
      'https://via.placeholder.com/600x600?text=Running+Shoes+1',
      'https://via.placeholder.com/600x600?text=Running+Shoes+2'
    ],
    seller: 'Sportify',
    sellerLocation: 'Kolkata, WB'
  },
  8: {
    description: 'Designer handbag in premium leather with secure compartments and chic styling.',
    images: [
      'https://via.placeholder.com/600x600?text=Designer+Handbag+1',
      'https://via.placeholder.com/600x600?text=Designer+Handbag+2'
    ],
    seller: 'Luxury Bags',
    sellerLocation: 'New Delhi, DL'
  },
  9: {
    description: 'Smart LED desk lamp with adjustable brightness and USB charging port.',
    images: [
      'https://via.placeholder.com/600x600?text=LED+Desk+Lamp+1',
      'https://via.placeholder.com/600x600?text=LED+Desk+Lamp+2'
    ],
    seller: 'Home Essentials',
    sellerLocation: 'Ahmedabad, GJ'
  },
  10: {
    description: 'HEPA air purifier with quiet mode and multi-stage filtration for clean air.',
    images: [
      'https://via.placeholder.com/600x600?text=Air+Purifier+1',
      'https://via.placeholder.com/600x600?text=Air+Purifier+2'
    ],
    seller: 'PureAir',
    sellerLocation: 'Surat, GJ'
  },
  11: {
    description: 'Non-stick cookware set for convenient everyday cooking and easy cleanup.',
    images: [
      'https://via.placeholder.com/600x600?text=Cookware+Set+1',
      'https://via.placeholder.com/600x600?text=Cookware+Set+2'
    ],
    seller: 'Chef Select',
    sellerLocation: 'Hyderabad, TS'
  },
  12: {
    description: 'Memory foam pillow designed for better neck support and restful sleep.',
    images: [
      'https://via.placeholder.com/600x600?text=Memory+Foam+Pillow+1',
      'https://via.placeholder.com/600x600?text=Memory+Foam+Pillow+2'
    ],
    seller: 'SleepWell',
    sellerLocation: 'Lucknow, UP'
  },
  13: {
    description: 'Vitamin C serum for brightening and hydration with antioxidant protection.',
    images: [
      'https://via.placeholder.com/600x600?text=Vitamin+C+Serum+1',
      'https://via.placeholder.com/600x600?text=Vitamin+C+Serum+2'
    ],
    seller: 'Beauty Bliss',
    sellerLocation: 'Gurugram, HR'
  },
  14: {
    description: 'Luxury perfume set with rich notes and elegant presentation for gifting.',
    images: [
      'https://via.placeholder.com/600x600?text=Perfume+Set+1',
      'https://via.placeholder.com/600x600?text=Perfume+Set+2'
    ],
    seller: 'Fragrance World',
    sellerLocation: 'Kanpur, UP'
  },
  15: {
    description: '2000W hair dryer with fast drying and multiple heat-speed settings.',
    images: [
      'https://via.placeholder.com/600x600?text=Hair+Dryer+1',
      'https://via.placeholder.com/600x600?text=Hair+Dryer+2'
    ],
    seller: 'Salon Pro',
    sellerLocation: 'Noida, UP'
  },
  16: {
    description: 'Complete skincare ritual kit with cleanser, toner, moisturizer, and glow serum.',
    images: [
      'https://via.placeholder.com/600x600?text=Skincare+Kit+1',
      'https://via.placeholder.com/600x600?text=Skincare+Kit+2'
    ],
    seller: 'Glow Cosmetics',
    sellerLocation: 'Chandigarh, PB'
  }
};

const addresses = [];
const payments = [];
const locations = [
  { id: 'delhi', city: 'Delhi', state: 'Delhi', pin: '110001', courier: 'Ecom Express', deliveryDays: '2-4' },
  { id: 'mumbai', city: 'Mumbai', state: 'Maharashtra', pin: '400001', courier: 'BlueDart', deliveryDays: '2-5' },
  { id: 'bangalore', city: 'Bengaluru', state: 'Karnataka', pin: '560001', courier: 'DTDC', deliveryDays: '2-5' },
  { id: 'hyderabad', city: 'Hyderabad', state: 'Telangana', pin: '500001', courier: 'Delhivery', deliveryDays: '2-5' }
];

const paymentMethods = ['COD', 'UPI', 'Credit Card', 'Debit Card', 'NetBanking', 'Wallet'];

function enrichProduct(product) {
  return { ...product, ...productMetadata[product.id] };
}

function getTrackingEvents(order) {
  const base = [
    { status: 'placed', title: 'Order placed', timestamp: order.placedAt },
    { status: 'confirmed', title: 'Order confirmed', timestamp: order.updatedAt || order.placedAt }
  ];
  if (order.status === 'shipped' || order.status === 'delivered') {
    base.push({ status: 'shipped', title: 'Shipped from warehouse', timestamp: order.shippedAt || new Date(Date.now() + 24*3600*1000).toISOString() });
  }
  if (order.status === 'delivered') {
    base.push({ status: 'delivered', title: 'Delivered to destination', timestamp: order.deliveredAt || order.estimatedDelivery });
  }
  return base;
}

/* ══════════════════════════════════════
   PRODUCT ROUTES
══════════════════════════════════════ */

// GET all products (with optional ?category=&search=)
app.get('/api/products', (req, res) => {
  const { category, search, sort } = req.query;
  let result = [...products];
  if (category && category !== 'all') result = result.filter(p => p.category === category);
  if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  if (sort === 'price_asc') result.sort((a,b) => a.price - b.price);
  else if (sort === 'price_desc') result.sort((a,b) => b.price - a.price);
  else if (sort === 'rating') result.sort((a,b) => b.rating - a.rating);
  result = result.map(enrichProduct);
  res.json({ success: true, count: result.length, data: result });
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const p = products.find(x => x.id === +req.params.id);
  if (!p) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data: enrichProduct(p) });
});

// POST add product (admin)
app.post('/api/products', (req, res) => {
  const { name, nameHi, category, price, original, emoji } = req.body;
  if (!name || !price) return res.status(400).json({ success: false, message: 'name and price required' });
  const product = {
    id: products.length + 1,
    name, nameHi: nameHi || name, category: category || 'electronics',
    price: +price, original: +(original || price),
    rating: 4.0, reviews: 0,
    discount: original ? Math.round((1 - price/original)*100) : 0,
    badge: 'new', emoji: emoji || '📦', stock: 100
  };
  products.push(product);
  res.status(201).json({ success: true, data: product });
});

// PUT update product
app.put('/api/products/:id', (req, res) => {
  const idx = products.findIndex(x => x.id === +req.params.id);
  if (idx < 0) return res.status(404).json({ success: false, message: 'Product not found' });
  products[idx] = { ...products[idx], ...req.body, id: products[idx].id };
  res.json({ success: true, data: products[idx] });
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const idx = products.findIndex(x => x.id === +req.params.id);
  if (idx < 0) return res.status(404).json({ success: false, message: 'Product not found' });
  products.splice(idx, 1);
  res.json({ success: true, message: 'Product deleted' });
});

/* ══════════════════════════════════════
   ORDER ROUTES
══════════════════════════════════════ */

// GET all orders
app.get('/api/orders', (req, res) => {
  res.json({ success: true, count: orders.length, data: orders });
});

// GET single order
app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === +req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, data: order });
});

// POST place order
app.post('/api/orders', (req, res) => {
  const { items, customer, address, paymentMethod } = req.body;
  if (!items || !items.length) return res.status(400).json({ success: false, message: 'No items in order' });

  // Validate stock
  for (const item of items) {
    const product = products.find(p => p.id === item.id);
    if (!product) return res.status(404).json({ success: false, message: `Product ${item.id} not found` });
    if (product.stock < item.qty) return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
  }

  // Deduct stock
  items.forEach(item => {
    const p = products.find(x => x.id === item.id);
    if (p) p.stock -= item.qty;
  });

  const total = items.reduce((s, i) => {
    const p = products.find(x => x.id === i.id);
    return s + (p ? p.price * i.qty : 0);
  }, 0);

  const order = {
    id: nextOrderId++,
    items,
    customer: customer || {},
    address: address || {},
    paymentMethod: paymentMethod || 'COD',
    total,
    paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid',
    shipping: {
      origin: 'Noida, UP',
      destination: address.city || address.town || 'Unknown',
      courier: locations.find(l => l.pin === (address.pin || '110001'))?.courier || 'Ecom Express',
      cost: 99,
      trackingId: `TRK${nextOrderId}${Date.now()}`
    },
    status: 'placed',
    placedAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 5*24*3600*1000).toISOString(),
    shipmentEvents: [
      { status: 'placed', title: 'Order received', timestamp: new Date().toISOString() }
    ]
  };

  orders.push(order);
  res.status(201).json({ success: true, data: order });
});

// PATCH update order status
app.patch('/api/orders/:id/status', (req, res) => {
  const order = orders.find(o => o.id === +req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  const { status } = req.body;
  const validStatuses = ['placed','confirmed','shipped','delivered','cancelled'];
  if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });
  order.status = status;
  order.updatedAt = new Date().toISOString();
  if (status === 'shipped') {
    order.shippedAt = new Date().toISOString();
    order.shipmentEvents.push({ status: 'shipped', title: 'Shipped from warehouse', timestamp: order.shippedAt });
  }
  if (status === 'delivered') {
    order.deliveredAt = new Date().toISOString();
    order.shipmentEvents.push({ status: 'delivered', title: 'Delivered to destination', timestamp: order.deliveredAt });
  }
  if (status === 'cancelled') {
    order.shipmentEvents.push({ status: 'cancelled', title: 'Order cancelled', timestamp: new Date().toISOString() });
  }
  res.json({ success: true, data: order });
});

// GET order tracking details
app.get('/api/orders/:id/track', (req, res) => {
  const order = orders.find(o => o.id === +req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, data: { trackingId: order.shipping?.trackingId, status: order.status, shipmentEvents: order.shipmentEvents, estimatedDelivery: order.estimatedDelivery } });
});

// PAYMENT ROUTES
app.post('/api/payments', (req, res) => {
  const { orderId, method, amount, details } = req.body;
  const order = orders.find(o => o.id === +orderId);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  if (!paymentMethods.includes(method)) return res.status(400).json({ success: false, message: 'Invalid payment method' });
  const payment = {
    id: payments.length + 1,
    orderId: order.id,
    method,
    amount: amount || order.total,
    status: method === 'COD' ? 'pending' : 'paid',
    details: details || {},
    createdAt: new Date().toISOString()
  };
  payments.push(payment);
  order.paymentStatus = payment.status;
  res.status(201).json({ success: true, data: payment });
});

app.get('/api/payments/:id', (req, res) => {
  const payment = payments.find(p => p.id === +req.params.id);
  if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
  res.json({ success: true, data: payment });
});

app.get('/api/payment-methods', (req, res) => {
  res.json({ success: true, data: paymentMethods });
});

// ADDRESS ROUTES
app.get('/api/users/:id/addresses', (req, res) => {
  const userAddresses = addresses.filter(a => a.userId === +req.params.id);
  res.json({ success: true, count: userAddresses.length, data: userAddresses });
});

app.post('/api/users/:id/addresses', (req, res) => {
  const user = users.find(u => u.id === +req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const address = { id: addresses.length + 1, userId: user.id, ...req.body, addedAt: new Date().toISOString() };
  addresses.push(address);
  res.status(201).json({ success: true, data: address });
});

// LOCATION ROUTES
app.get('/api/locations', (req, res) => {
  res.json({ success: true, data: locations });
});

app.get('/api/locations/:id', (req, res) => {
  const location = locations.find(l => l.id === req.params.id);
  if (!location) return res.status(404).json({ success: false, message: 'Location not found' });
  res.json({ success: true, data: location });
});

/* ══════════════════════════════════════
   USER / AUTH ROUTES
══════════════════════════════════════ */

// POST register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success: false, message: 'name, email and password required' });
  if (users.find(u => u.email === email)) return res.status(409).json({ success: false, message: 'Email already registered' });
  const user = { id: users.length + 1, name, email, phone: phone || '', createdAt: new Date().toISOString() };
  users.push({ ...user, password }); // NOTE: hash passwords in production!
  res.status(201).json({ success: true, message: 'Registered successfully', data: user });
});

// POST login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  const { password: _, ...safeUser } = user;
  res.json({ success: true, message: 'Login successful', data: safeUser, token: `token_${safeUser.id}_${Date.now()}` });
});

// GET user profile
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === +req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const { password: _, ...safeUser } = user;
  res.json({ success: true, data: safeUser });
});

/* ══════════════════════════════════════
   CATEGORIES ROUTE
══════════════════════════════════════ */
app.get('/api/categories', (req, res) => {
  const cats = [...new Set(products.map(p => p.category))];
  const data = cats.map(c => ({
    name: c,
    count: products.filter(p => p.category === c).length
  }));
  res.json({ success: true, data });
});

/* ══════════════════════════════════════
   SEARCH ROUTE
══════════════════════════════════════ */
app.get('/api/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ success: true, data: [] });
  const results = products.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.category.toLowerCase().includes(q.toLowerCase())
  ).map(enrichProduct);
  res.json({ success: true, count: results.length, data: results });
});

/* ══════════════════════════════════════
   HEALTH CHECK
══════════════════════════════════════ */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString(), environment: NODE_ENV });
});

// 404 handler for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Serve index.html for all other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🛒 AdiCart API running at http://localhost:${PORT}`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
  console.log(`🛍️  Orders API:  http://localhost:${PORT}/api/orders`);
  console.log(`👤 Auth API:    http://localhost:${PORT}/api/auth/register`);
  console.log(`🌍 Environment: ${NODE_ENV}\n`);
});
