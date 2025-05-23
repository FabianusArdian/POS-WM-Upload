# 🍽️ POS - Warung Makan

## 📋 Overview

A full-featured Point of Sale (POS) system built using **Next.js**, designed specifically for restaurants and small food businesses in Indonesia (UMKM). This POS provides intuitive interfaces for sales, inventory, product management, and reporting with real-time order handling.

**Live Deployment**: [POS WARUNG MAKAN](https://pos-project-revou.vercel.app/)

---

## 🚀 Features

### ✅ Point of Sale (Sales Interface)
- **Product Management**: Add products to cart with quantity adjustments
- **Discount System**: Apply discounts by percentage or nominal amount
- **Customer Types**: Categorize orders by customer type (Dine-in, Grab, Gojek, Shopee)
- **Payment Options**: Multiple payment methods (Cash, QRIS, Transfer)
- **Order Management**: Hold & recall orders for later processing
- **Receipt Generation**: Print detailed receipts for customers
- **Real-time Processing**: Checkout with instant order saving to database
- **Order Notes**: Add special instructions or notes to orders

### 📦 Inventory & Product Management
- **Product Catalog**: Comprehensive product database with categories
- **Recipe Management**: Add/update/delete recipes with ingredient tracking
- **Inventory Tracking**: Monitor stock levels with minimum threshold alerts
- **Ingredient Breakdown**: View detailed ingredient requirements for each product
- **Unit Management**: Track inventory in appropriate units (kg, pack, liter, etc.)
- **Image Support**: Add product images for visual identification

### 📊 Reports & Analytics
- **Sales Tracking**: Daily, monthly & yearly order tracking with detailed breakdowns
- **Advanced Filtering**: Pagination & filtering by payment status, date ranges
- **Invoice Details**: Comprehensive view of individual transactions
- **Exportable Data**: Export reports to PDF/Excel for offline
- **Category Analysis**: Sales breakdown by product categories
- **Popular Products**: Track best-selling items over time periods
- **Price Range Analysis**: Analyze sales performance across price points
- **Time-based Analysis**: Identify peak hours and busiest days

### 💰 Cash Management
- **Cash Tracking**: Monitor cash balance
- **Transaction Categories**: Categorize income and expenses
- **Reconciliation**: Balance verification per user
- **Income & Expense Tracking**: Detailed breakdown of income and expenses
- **Transaction History**: Complete log of all cash movements

### 🔐 Authentication & Security
- **Secure Login**: Token-based authentication system
- **Role-based Access**: Different permission levels for `admin` and `cashier`
- **Session Management**: Track user login/activity
- **Protected Routes**: Secure access to sensitive areas

---

## 🛠️ Technical Architecture

### Frontend Architecture
- **Framework**: [Next.js 14 (App Router, TypeScript)](https://nextjs.org/)
- **State Management**: React Hooks for local state management
- **Styling**: Tailwind CSS for responsive design
- **UI Components**: Shadcn UI for consistent interface elements
- **Icons**: Lucide React Icons
- **Data Visualization**: Custom charts and data displays

### Backend Integration
- **API**: RESTful API built with FastAPI (external)
- **Authentication**: JWT token-based authentication
- **Data Fetching**: Server-side and client-side data fetching strategies

### Data Models

#### Product Model
- Product information including name, price, category, unit
- Support for package products and discounts

#### Order System
- Comprehensive order tracking with items, payment status
- Support for different customer types and payment methods

#### Inventory System
- Stock tracking with minimum thresholds
- Unit-based inventory management

#### Recipe Management
- Ingredient tracking for each product
- Quantity and unit specifications

#### Cash Balance System
- Transaction tracking for income and expenses
- Categorized financial management

---

## 📱 User Interfaces

### Main Interfaces
1. **Sales Interface**: Primary POS screen for order processing
2. **Inventory Management**: Stock control and monitoring
3. **Product Management**: Product catalog maintenance
4. **Recipe Management**: Ingredient and recipe control
5. **Reports Dashboard**: Analytics and reporting tools
6. **Cash Management**: Financial tracking interface
7. **Settings**: System configuration options

### User Roles
- **Admin**: Full access to all system features
- **Cashier**: Limited access to sales and basic reporting

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/revou-next-project/Pos-WarungMakan-Frontend.git
cd Pos-WarungMakan-Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_API_URL=https://api-pwk.ahmadcloud.my.id
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
npm start
```

---

## 📊 Product Requirements Document (PRD)

### Product Vision
To provide small food businesses with an affordable, easy-to-use POS system that streamlines operations, improves inventory management, and provides valuable business insights.

### Target Users
- **Restaurant Owners**: Small to medium-sized food establishments
- **Cashiers**: Staff handling daily sales operations
- **Kitchen Staff**: For order processing and inventory management
- **Managers**: For reporting and business analysis

### User Stories

#### As a Restaurant Owner
- I want to track daily sales to understand business performance
- I want to monitor inventory to prevent stockouts
- I want to analyze popular products to optimize my menu
- I want to manage cash flow to ensure financial stability

#### As a Cashier
- I want a simple interface to process orders quickly
- I want to easily apply discounts when needed
- I want to hold orders for customers who aren't ready to pay
- I want to generate receipts for customers

#### As a Manager
- I want detailed reports to make informed business decisions
- I want to track staff performance during shifts
- I want to monitor cash balances throughout the day

### Functional Requirements

#### Order Processing
- System must allow adding multiple products to an order
- System must calculate totals including any applicable discounts
- System must support different payment methods
- System must generate printable receipts
- System must allow order holding and recall

#### Inventory Management
- System must track current stock levels
- System must alert when items fall below threshold
- System must update inventory when products are sold
- System must support adding new inventory items

#### Reporting
- System must provide daily and monthly sales reports
- System must analyze sales by category, time, and price range
- System must track popular products
- System must allow filtering of reports by various parameters

#### User Management
- System must support different user roles with appropriate permissions
- System must provide secure authentication
- System must track user actions for accountability

### Non-Functional Requirements

#### Performance
- System must process orders within 3 seconds
- System must handle up to 1000 products without performance degradation
- Reports must generate within 5 seconds

#### Security
- All user passwords must be securely hashed
- Access to financial data must be restricted to authorized users
- Session timeout after 30 minutes of inactivity

#### Usability
- Interface must be usable on both desktop and mobile devices
- New cashiers should be able to learn the system within 1 hour of training
- System must provide clear error messages

### Future Enhancements

#### Phase 2
- Customer loyalty program integration
- Advanced inventory forecasting
- Staff scheduling and performance tracking
- Integration with accounting software
- Mobile app for remote monitoring

#### Phase 3
- Multi-location support
- Advanced analytics with AI-powered insights
- Online ordering integration
- Kitchen display system
- Automated supplier ordering

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the Team 2 RevoU Next Batch Feb 2025.

---

## 📞 Contact

For questions or support, please contact the development team.
