# Retail Inventory Management System - Backend API

Node.js/Express backend API for the Retail Inventory Management System.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup database (make sure PostgreSQL is running)
# Run schema.sql and seed.sql from database folder

# Start development server
npm run dev
```

The API will be available at `http://localhost:5000`

## 📦 What's Included

### ✅ Complete API Implementation
- **8 Resource Endpoints** - Auth, Products, Inventory, Orders, Suppliers, Locations, Users, Reports
- **JWT Authentication** - Secure token-based auth
- **Role-Based Access Control** - Admin, Manager, Staff, Viewer roles
- **Input Validation** - Joi validation middleware
- **Error Handling** - Centralized error handling
- **Logging** - Winston logger
- **Rate Limiting** - Protection against abuse
- **CORS** - Cross-origin resource sharing configured

### ✅ Models (Sequelize ORM)
- User
- Product
- Category
- Location
- Inventory
- Customer
- SalesOrder
- SalesOrderItem
- Supplier
- PurchaseOrder

### ✅ Controllers
- Auth Controller - Login, logout, get current user
- Product Controller - CRUD operations
- Inventory Controller - Track inventory, adjustments
- Order Controller - Create and manage orders
- Supplier Controller - Manage suppliers
- Location Controller - Get locations
- User Controller - User management (admin only)
- Report Controller - Dashboard stats

### ✅ Middleware
- **auth.js** - JWT verification, role authorization
- **validate.js** - Request validation
- **errorHandler.js** - Global error handling
- **notFound.js** - 404 handler
- **rateLimiter.js** - Rate limiting

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user (protected)
POST   /api/auth/logout      - Logout user (protected)
```

### Products
```
GET    /api/products         - Get all products (protected)
GET    /api/products/:id     - Get single product (protected)
POST   /api/products         - Create product (admin, manager)
PUT    /api/products/:id     - Update product (admin, manager)
DELETE /api/products/:id     - Delete product (admin)
```

### Inventory
```
GET    /api/inventory                    - Get inventory (protected)
GET    /api/inventory/location/:id       - Get inventory by location (protected)
POST   /api/inventory/adjust             - Adjust inventory (admin, manager, staff)
```

### Orders
```
GET    /api/orders           - Get all orders (protected)
GET    /api/orders/:id       - Get single order (protected)
POST   /api/orders           - Create order (protected)
PUT    /api/orders/:id/status - Update order status (admin, manager)
```

### Suppliers
```
GET    /api/suppliers        - Get all suppliers (protected)
GET    /api/suppliers/:id    - Get single supplier (protected)
POST   /api/suppliers        - Create supplier (admin, manager)
PUT    /api/suppliers/:id    - Update supplier (admin, manager)
```

### Locations
```
GET    /api/locations        - Get all locations (protected)
GET    /api/locations/:id    - Get single location (protected)
```

### Users
```
GET    /api/users            - Get all users (admin only)
GET    /api/users/:id        - Get single user (admin only)
```

### Reports
```
GET    /api/reports/dashboard - Get dashboard stats (protected)
```

## 🔑 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Login Example
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Test@123"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "admin@example.com",
      "first_name": "Admin",
      "last_name": "User",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 🔐 User Roles

- **admin** - Full access to all resources
- **manager** - Can manage products, inventory, orders, suppliers
- **staff** - Can view and adjust inventory, create orders
- **viewer** - Read-only access

## 📝 Sample Requests

### Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "PROD-001",
    "name": "Test Product",
    "unit_price": 29.99,
    "min_stock_level": 10,
    "reorder_point": 20
  }'
```

### Get Products with Pagination
```bash
curl "http://localhost:5000/api/products?page=1&limit=20&search=phone" \
  -H "Authorization: Bearer <token>"
```

### Get Inventory
```bash
curl "http://localhost:5000/api/inventory?location_id=..." \
  -H "Authorization: Bearer <token>"
```

## 🗄️ Database

Make sure PostgreSQL is running and the database is set up:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE retail_inventory;

# Run schema
psql -U postgres -d retail_inventory -f ../database/schema.sql

# Run seed data
psql -U postgres -d retail_inventory -f ../database/seed.sql
```

## 🛠️ Available Scripts

```bash
# Start development server with nodemon (auto-reload)
npm run dev

# Start production server
npm start

# Run tests
npm test

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📂 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Sequelize configuration
│   ├── controllers/             # Request handlers
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── inventory.controller.js
│   │   ├── order.controller.js
│   │   ├── supplier.controller.js
│   │   ├── location.controller.js
│   │   ├── user.controller.js
│   │   └── report.controller.js
│   ├── middleware/              # Custom middleware
│   │   ├── auth.js
│   │   ├── validate.js
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   └── rateLimiter.js
│   ├── models/                  # Sequelize models
│   │   ├── index.js
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Location.js
│   │   ├── Inventory.js
│   │   ├── Customer.js
│   │   ├── SalesOrder.js
│   │   ├── SalesOrderItem.js
│   │   ├── Supplier.js
│   │   └── PurchaseOrder.js
│   ├── routes/                  # API routes
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── inventory.routes.js
│   │   ├── order.routes.js
│   │   ├── supplier.routes.js
│   │   ├── location.routes.js
│   │   ├── user.routes.js
│   │   └── report.routes.js
│   ├── utils/                   # Helper functions
│   │   ├── logger.js
│   │   └── response.js
│   └── server.js                # Express app entry point
├── logs/                        # Log files
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── package.json
└── README.md
```

## 🐛 Error Handling

All errors return a consistent format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## 🔧 Configuration

All configuration is done through environment variables in `.env` file:

- **NODE_ENV** - development/production
- **PORT** - Server port (default: 5000)
- **DB_*** - Database connection details
- **JWT_SECRET** - Secret key for JWT tokens
- **CORS_ORIGIN** - Allowed frontend origin

## 🚀 Deployment

### Production Checklist
- [ ] Change JWT_SECRET to a strong random string
- [ ] Set NODE_ENV=production
- [ ] Update database credentials
- [ ] Configure CORS_ORIGIN for your frontend domain
- [ ] Enable SSL/HTTPS
- [ ] Set up PM2 or similar process manager
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up logging and monitoring

### Start with PM2
```bash
npm install -g pm2
pm2 start src/server.js --name retail-inventory-api
pm2 save
pm2 startup
```

## 📞 Support

For issues or questions:
- Check the logs in `logs/` directory
- Review environment variables in `.env`
- Verify database connection
- Check PostgreSQL is running

---

**Status:** ✅ Complete & Ready  
**Version:** 1.0.0  
**Last Updated:** 2026-04-07
