# Retail Inventory Management System - Frontend

React-based frontend application for the Retail Inventory Management System.

## 🚀 Quick Start

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## 📦 What's Included

### ✅ Complete Application Structure
- React 18 with React Router v6
- Material-UI (MUI) for UI components
- Redux Toolkit for state management
- Axios for API calls
- React Hook Form for forms
- Recharts for data visualization

### ✅ Pages Implemented
- **Login Page** - Fully functional authentication
- **Dashboard** - Overview with stats cards
- **Products** - List and Form (Add/Edit)
- **Inventory** - List view
- **Orders** - List and Form
- **Suppliers** - List view
- **Reports** - Placeholder
- **Profile** - Placeholder
- **Settings** - Placeholder
- **404 Page** - Not Found

### ✅ Components
- **MainLayout** - Dashboard layout with sidebar and header
- **AuthLayout** - Authentication layout
- **Sidebar** - Navigation menu
- **Header** - Top app bar with user menu

### ✅ State Management (Redux)
- **authSlice** - Authentication state
- **productSlice** - Product management
- **inventorySlice** - Inventory tracking
- **orderSlice** - Order management
- **uiSlice** - UI state (sidebar, theme)

### ✅ Services (API Integration)
- **api.js** - Axios instance with interceptors
- **authService** - Login, logout, get current user
- **productService** - CRUD operations
- **inventoryService** - Inventory operations
- **orderService** - Order operations

## 🎨 Design Features

- **Material Design** - Using Material-UI components
- **Responsive** - Works on desktop, tablet, and mobile
- **Dark Mode Ready** - Theme system in place
- **Professional UI** - Clean and modern interface
- **Icons** - Material Icons integrated

## 📝 Default Credentials

```
Admin:
Email: admin@example.com
Password: Test@123

Manager:
Email: manager@example.com
Password: Test@123
```

## 🛠️ Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## 📂 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── layouts/
│   │   │   ├── MainLayout.js
│   │   │   └── AuthLayout.js
│   │   ├── Header.js
│   │   └── Sidebar.js
│   ├── pages/
│   │   ├── auth/
│   │   │   └── Login.js
│   │   ├── products/
│   │   │   ├── ProductList.js
│   │   │   └── ProductForm.js
│   │   ├── inventory/
│   │   │   └── InventoryList.js
│   │   ├── orders/
│   │   │   ├── OrderList.js
│   │   │   └── OrderForm.js
│   │   ├── suppliers/
│   │   │   └── SupplierList.js
│   │   ├── Dashboard.js
│   │   ├── Reports.js
│   │   ├── Profile.js
│   │   ├── Settings.js
│   │   └── NotFound.js
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── inventoryService.js
│   │   └── orderService.js
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── productSlice.js
│   │   │   ├── inventorySlice.js
│   │   │   ├── orderSlice.js
│   │   │   └── uiSlice.js
│   │   └── index.js
│   ├── App.js
│   ├── index.js
│   └── theme.js
├── package.json
└── README.md
```

## 🔌 API Integration

The frontend is configured to connect to the backend API at:
```
http://localhost:5000/api
```

Change this in `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎯 Next Steps

1. **Complete Backend APIs** - Implement missing endpoints
2. **Form Validation** - Add Yup validation schemas
3. **Error Handling** - Improve error messages
4. **Loading States** - Add skeletons and progress indicators
5. **Data Tables** - Add sorting, filtering, pagination
6. **Charts** - Add more visualizations
7. **File Upload** - Implement image upload for products
8. **Notifications** - Add toast notifications for actions
9. **Tests** - Write unit and integration tests
10. **PWA** - Make it a Progressive Web App

## 🐛 Known Issues

- Backend API not implemented yet - forms will show errors
- Some pages are placeholders
- No real data validation
- Mock data in dashboard

## 📚 Documentation

- [React Documentation](https://react.dev)
- [Material-UI Documentation](https://mui.com)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
- [React Router Documentation](https://reactrouter.com)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

**Status:** ✅ Frontend Setup Complete  
**Version:** 1.0.0  
**Last Updated:** 2026-04-07
