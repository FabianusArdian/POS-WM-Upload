# 🍽️ POS - Warung Makan

A full-featured Point of Sale (POS) system built using **Next.js**, designed for restaurants and small food businesses. This POS provides intuitive interfaces for sales, inventory, product management, and reporting with real-time order handling.
Deployement: ent: [POS WARUNG MAKAN](https://pos-project-revou.vercel.app/)

---

## 🚀 Features

### ✅ Point of Sale (Sales Interface)
- Add products to cart
- Apply discounts (percentage/nominal)
- Choose customer type (Dine-in, Grab, Gojek, Shopee)
- Select payment methods (Cash, QRIS, Transfer)
- Hold & recall orders
- Print receipt
- Checkout with real-time order saving

### 📦 Inventory & Product Management
- Manage product catalog
- Add/update/delete recipes and inventory
- View ingredient breakdown for each product

### 📊 Reports
- Daily & monthly order tracking
- Pagination & filtering by payment status
- Invoice detail view
- Exportable records (coming soon)

### 💰 Cash Management
- Track cash balance by shift (soon)
- Reconciliation per user (soon)

### 🔐 Authentication & Role
- Login with token-based auth
- Role-based access: `admin`, `cashier`

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 14 (App Router, TypeScript)](https://nextjs.org/)
- **Backend**: FastAPI (external)
- **State**: React Hooks
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icons
- **UI**: Shadcn UI

---

## ⚙️ Installation

### 1. Clone Repo

`git clone https://github.com/revou-next-project/Pos-WarungMakan-Frontend.git`

### 2. Install Dependencies

`npm install`

### 3. Setup Environment Variables
Buat file .env.local:

NEXT_PUBLIC_API_URL=https://api-pwk.ahmadcloud.my.id

### 4 Start Dev Server

`npm run dev`
