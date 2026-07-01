# Urban Brew Café - Premium Web Application

A complete, production-ready, fully responsive premium café website built using **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM** with **MySQL**.

---

## 🌟 Key Features

1. **Luxury Responsive Design:** Dark/Light theme toggle supporting warm luxury coffee aesthetics.
2. **Dynamic Menu System:** Filter by Hot Coffee, Cold Coffee, Tea, Milkshakes, Smoothies, Bakery, Breakfast, Lunch, Dinner, or search & sort by ratings and prices.
3. **Drink Customizer:** Modal options to modify size (Regular, Large, Grande), milk replacements (Oat, Almond, Soy), and sweetness levels.
4. **Online Ordering & Cart:** Cart drawer & dedicated cart review pages with tax calculations, delivery methods (Delivery vs Pickup), and active promo coupons.
5. **Simulated Payment Gateways:** Test flows for Stripe, Razorpay, UPI, and Cash on Delivery with visual invoices and printable receipt generator.
6. **Visual Reservations Floor:** Interactive date/time slot picker with visual floor table layout picker (couples seats, VIP booths, counter stools).
7. **AI Digital Barista:** Virtual assistant widget answering questions regarding menu items, business hours, coupons, and directions.
8. **Admin Panel Dashboard:** Management tabs for overall sales metrics, orders status modification, reservation confirmations, product inventory listings, and secure audit logs.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion, Lucide Icons, Canvas Confetti.
- **Backend:** Next.js Route Handlers (REST API), NextAuth (Authentication).
- **Database:** MySQL relational database.
- **ORM:** Prisma Client.

---

## 🚀 Quick Start Guide

### 1. Configure Database Connection

Make sure you have a running MySQL Server (Local, XAMPP, or Cloud). Copy the environment variables example file:
```bash
cp .env.example .env
```
Open `.env` and set your `DATABASE_URL`:
```env
DATABASE_URL="mysql://username:password@localhost:3306/urban_brew"
```

### 2. Install Dependencies

Install required package dependencies:
```bash
npm install
```

### 3. Generate Client & Run Migrations

Perform Prisma setup to prepare database tables:
```bash
npx prisma db push
```

### 4. Seed the Database

Populate initial premium coffee menus, admin/user accounts, reviews, and coupon codes:
```bash
npx prisma db seed
```

### 5. Run Local Development Server

Launch the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🔒 Default Admin Credentials

For testing the **Admin Dashboard** panel (/admin) and payment histories:
- **Email:** `admin@urbanbrew.com`
- **Password:** `admin123`

For testing customer loyalty points and orders:
- **Email:** `customer@urbanbrew.com`
- **Password:** `customer123`

---

## 🐳 Docker Support

A `docker-compose.yml` file is provided to spawn a local MySQL container quickly.
```bash
docker-compose up -d
```
This boots up a MySQL container listening on port `3306` with database `urban_brew`. Modify the credentials in your `.env` to match `root` / `rootpassword` to connect.

---

## 🌐 API Documentation

### Products
- `GET /api/products` - Returns a JSON list of all menu products (falls back to static arrays if database connection fails).
- `POST /api/products` - Creates a new product row (Requires name, price, description, calories, ingredients, nutritionInfo, category, image).

### Orders
- `GET /api/orders` - Lists past customer orders.
- `POST /api/orders` - Submits a new customer checkout payload, calculating taxes, discount deductions, and saving items.

### Reservations
- `GET /api/reservations` - Lists booked reservation dates and slots.
- `POST /api/reservations` - Records a new table booking, date, time slot, and guests count.
