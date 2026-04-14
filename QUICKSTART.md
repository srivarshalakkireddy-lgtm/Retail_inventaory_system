# 🚀 Quick Start Guide - Retail Inventory Management System

## What We've Created So Far

✅ **Complete Project Structure**
✅ **Database Schema** (PostgreSQL with 20+ tables)
✅ **Seed Data** (Sample products, users, orders, locations)
✅ **Docker Setup** (docker-compose.yml for easy development)
✅ **Backend Foundation** (Express.js with Node.js)
✅ **Documentation** (Implementation plan, user stories, architecture)

---

## 📁 Project Structure Overview

```
retail-inventory-system/
├── PROJECT_DOCUMENTATION.md       ← Full project requirements
├── PROJECT_IMPLEMENTATION_PLAN.md ← Sprint-by-sprint plan
├── QUICKSTART.md                  ← This file!
├── README.md                      ← Project overview
├── docker-compose.yml             ← Docker configuration
├── .gitignore                     ← Git ignore rules
│
├── database/
│   ├── schema.sql                 ← Database schema (tables, indexes, views)
│   └── seed.sql                   ← Sample data for testing
│
├── backend/
│   ├── package.json               ← Node.js dependencies
│   ├── .env.example               ← Environment variables template
│   └── src/
│       └── server.js              ← Express server entry point
│
├── frontend/                      ← (To be created)
├── docs/                          ← (Documentation to be added)
├── devops/                        ← (CI/CD configs to be added)
└── tests/                         ← (Tests to be added)
```

---

## ⚡ Getting Started in 3 Steps

### Step 1: Install Prerequisites

**Install the following software:**

1. **Node.js (v18+)** - [Download](https://nodejs.org/)
   ```bash
   node --version  # Should be 18.0.0 or higher
   npm --version   # Should be 9.0.0 or higher
   ```

2. **PostgreSQL (v14+)** - [Download](https://www.postgresql.org/download/)
   ```bash
   psql --version  # Should be 14.0 or higher
   ```

3. **Git** - [Download](https://git-scm.com/downloads)
   ```bash
   git --version
   ```

4. **Docker Desktop (Optional but Recommended)** - [Download](https://www.docker.com/products/docker-desktop)
   ```bash
   docker --version
   docker-compose --version
   ```

5. **VS Code or your favorite IDE** - [Download VS Code](https://code.visualstudio.com/)

---

### Step 2: Setup the Project

#### Option A: Using Docker (Easiest - Recommended)

```bash
# 1. Navigate to project directory
cd C:\Mayank\retail-inventory-system

# 2. Start all services (database, backend, frontend)
docker-compose up -d

# 3. Check if services are running
docker-compose ps

# 4. View logs
docker-compose logs -f backend

# That's it! Your system is running:
# - PostgreSQL: http://localhost:5432
# - Backend API: http://localhost:5000
# - pgAdmin: http://localhost:5050 (admin@example.com / admin123)
```

#### Option B: Manual Setup (Without Docker)

```bash
# 1. Setup PostgreSQL Database
psql -U postgres
CREATE DATABASE retail_inventory;
\q

# 2. Run database schema
psql -U postgres -d retail_inventory -f database/schema.sql

# 3. Run seed data
psql -U postgres -d retail_inventory -f database/seed.sql

# 4. Setup Backend
cd backend
npm install
cp .env.example .env

# 5. Edit .env file with your database credentials
# Open .env in VS Code and update:
#   DB_HOST=localhost
#   DB_PASSWORD=your_postgres_password
#   JWT_SECRET=some-random-secret-key

# 6. Start backend server
npm run dev

# Backend will run on: http://localhost:5000
```

---

### Step 3: Verify Installation

**Test the API:**

```bash
# Health check
curl http://localhost:5000/health

# You should see:
{
  "status": "OK",
  "timestamp": "2026-04-07T...",
  "uptime": 123.45,
  "environment": "development"
}
```

**Access pgAdmin (if using Docker):**
1. Open browser: http://localhost:5050
2. Login: admin@example.com / admin123
3. Add server:
   - Host: postgres
   - Port: 5432
   - Database: retail_inventory
   - Username: postgres
   - Password: postgres123

---

## 🎯 What's Next? Development Roadmap

### Phase 1: Complete Backend Setup (Week 1)

**What we need to create:**

1. **Database Models** (Sequelize ORM)
   - `src/models/User.js`
   - `src/models/Product.js`
   - `src/models/Inventory.js`
   - etc.

2. **Middleware**
   - ✅ `src/middleware/errorHandler.js` (Created)
   - ✅ `src/middleware/rateLimiter.js` (Created)
   - `src/middleware/auth.js` (Authentication)
   - `src/middleware/validate.js` (Validation)

3. **Controllers** (Business Logic)
   - `src/controllers/auth.controller.js`
   - `src/controllers/product.controller.js`
   - `src/controllers/inventory.controller.js`
   - etc.

4. **Routes** (API Endpoints)
   - ✅ `src/routes/auth.routes.js` (Stub created)
   - ✅ `src/routes/product.routes.js` (Stub created)
   - etc.

5. **Services** (Data Access Layer)
   - `src/services/auth.service.js`
   - `src/services/product.service.js`
   - etc.

6. **Utils** (Helper Functions)
   - ✅ `src/utils/logger.js` (Created)
   - `src/utils/response.js`
   - `src/utils/validation.js`

**Estimated Time:** 3-4 days

---

### Phase 2: Build Frontend (Week 2-3)

**What we need to create:**

1. **Setup React App**
   ```bash
   npx create-react-app frontend
   cd frontend
   npm install @mui/material @emotion/react @emotion/styled
   npm install axios react-router-dom redux @reduxjs/toolkit
   npm install react-hook-form yup recharts
   ```

2. **Project Structure**
   ```
   frontend/src/
   ├── components/       ← Reusable UI components
   ├── pages/           ← Page components
   ├── services/        ← API calls
   ├── store/           ← Redux state management
   ├── utils/           ← Helper functions
   ├── App.js           ← Main app component
   └── index.js         ← Entry point
   ```

3. **Key Pages to Build**
   - Login/Register
   - Dashboard
   - Product Management
   - Inventory Management
   - Order Management
   - Reports & Analytics

**Estimated Time:** 7-10 days

---

### Phase 3: Integration & Testing (Week 4)

1. Write unit tests
2. Integration tests
3. E2E tests with Cypress
4. Bug fixes

**Estimated Time:** 3-5 days

---

## 📚 Default Test Accounts

Once the system is set up with seed data, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | Test@123 |
| Manager | manager@example.com | Test@123 |
| Staff | staff1@example.com | Test@123 |
| Viewer | viewer@example.com | Test@123 |

⚠️ **These are for development only! Change in production.**

---

## 🧪 Testing the Database

```bash
# Connect to PostgreSQL
psql -U postgres -d retail_inventory

# Run some queries:
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM inventory;
SELECT * FROM v_current_inventory LIMIT 10;
SELECT * FROM v_low_stock_alert;

# Exit
\q
```

---

## 📖 Sample Data Overview

The seed data includes:

- **5 Users** (Admin, Manager, 2 Staff, Viewer)
- **5 Locations** (2 Warehouses, 3 Stores)
- **7 Product Categories**
- **10 Products** (Electronics, Apparel, Home Goods)
- **11 Inventory Records** across locations
- **4 Suppliers**
- **4 Customers**
- **3 Sales Orders** (with order items)
- **2 Purchase Orders** (with PO items)

---

## 🛠️ Common Commands

### Docker Commands
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Restart a service
docker-compose restart backend

# Rebuild after code changes
docker-compose up -d --build

# Remove all containers and volumes (CAUTION!)
docker-compose down -v
```

### Backend Commands
```bash
cd backend

# Install dependencies
npm install

# Run in development mode (with auto-reload)
npm run dev

# Run in production mode
npm start

# Run tests
npm test

# Run linter
npm run lint

# Reset database
npm run db:reset
```

### Database Commands
```bash
# Backup database
pg_dump -U postgres retail_inventory > backup.sql

# Restore database
psql -U postgres -d retail_inventory < backup.sql

# Connect to database
psql -U postgres -d retail_inventory
```

---

## 🐛 Troubleshooting

### Issue: "Port 5432 already in use"
**Solution:** Another PostgreSQL instance is running
```bash
# Windows: Stop PostgreSQL service
net stop postgresql-x64-14

# Or use a different port in docker-compose.yml
ports:
  - "5433:5432"
```

### Issue: "Cannot connect to database"
**Solution:** Check credentials in .env file
```bash
# Verify PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres
```

### Issue: "npm install fails"
**Solution:** Clear npm cache and try again
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Module not found"
**Solution:** Make sure you're in the correct directory
```bash
cd backend
npm install
```

---

## 📞 Need Help?

**Next Steps to Get Help:**

1. Check the error logs:
   ```bash
   docker-compose logs backend
   ```

2. Verify all services are running:
   ```bash
   docker-compose ps
   ```

3. Check the documentation:
   - `PROJECT_DOCUMENTATION.md` - Full requirements
   - `PROJECT_IMPLEMENTATION_PLAN.md` - Sprint plan
   - `README.md` - Project overview

4. Common issues are usually:
   - Missing environment variables (.env file)
   - Database connection problems
   - Port conflicts
   - Missing dependencies (run `npm install`)

---

## ✅ Checklist: Are You Ready?

- [ ] Node.js 18+ installed
- [ ] PostgreSQL 14+ installed (or Docker Desktop)
- [ ] Git installed
- [ ] VS Code or IDE installed
- [ ] Project cloned/downloaded
- [ ] Docker running (if using Docker)
- [ ] Database created
- [ ] Schema applied
- [ ] Seed data loaded
- [ ] Backend running on port 5000
- [ ] Can access http://localhost:5000/health

---

## 🎉 You're All Set!

**Your development environment is ready. Let's start building!**

**Immediate next steps:**

1. Complete the backend API endpoints (see Phase 1 above)
2. Build the React frontend
3. Write tests
4. Deploy to staging

**Want me to help you with the next step?** Just ask:
- "Help me create the authentication middleware"
- "Help me build the Product API controller"
- "Help me setup the React frontend"
- "Help me create the login page"

---

**Happy Coding! 🚀**
