# Project Deli 💡 🛸

A high-end, premium e-commerce platform specializing in **3D Printed Lamps & Custom Drone Parts**. Features an interactive 3D product customizer, fully integrated order processing, administrative tools, support ticketing, and user dashboards.

Built as a **TypeScript Monorepo** leveraging workspaces to share types and validation schemas seamlessly between the client and server.

---

## 🏗️ Project Architecture

The project is structured as a monorepo under the following workspace directories:

* **[client/](./client)**: The frontend single page application built using **Vite**, **React**, and **Tailwind CSS v4**. Includes interactive 3D elements powered by **Three.js** and **React Three Fiber**.
* **[server/](./server)**: The backend API service built with **Express** and **Prisma ORM** connecting to **MongoDB**.
* **[shared/](./shared)**: Shared logic, types, and **Zod** validation schemas shared between the client and server to guarantee absolute type-safety.

---

## 🚀 Key Features

* ✨ **Light Luxury Theme & Premium UI**: Apple-inspired cinematic intro screen, fluid glassmorphism components, and a cohesive "Warm White" aesthetic optimized with Framer Motion.
* 💻 **Interactive 3D Product Customizer**: View and modify 3D printed lamps and drone parts directly in the browser via Three.js, React Three Fiber, GSAP, and Framer Motion.
* 🛍️ **Full-Featured Cart & E-commerce System**: High-performance cart management backed by Zustand and fully-integrated **Stripe payments**.
* 🛡️ **Role-Based Auth & Security**: User authentication (BCrypt, JWT) supporting custom roles (`SUPER_ADMIN`, `ADMIN`, `EDITOR`, `CUSTOMER_SUPPORT`, `USER`). Armed with security middlewares (`helmet`, `express-rate-limit`, `cors`, `compression`).
* 📦 **Prisma & MongoDB Integration**: Advanced schema mapping for product catalogs, warehouse inventory tracking, stock movements, and audit logging.
* 📧 **Automated transactional emails**: Powered by Resend.
* 🌅 **Cloud Storage**: Media uploads managed via Multer and stored on Cloudinary.
* 🎫 **Customer Support Ticket System**: Built-in support tickets for user-admin communications.

---

## 🛠️ Tech Stack

### Frontend (`client/`)
* **Vite** + **React 19** + **TypeScript**
* **Tailwind CSS v4** for styling
* **Three.js** / **React Three Fiber** / **Drei** for 3D interactions
* **Zustand** (State management)
* **TanStack React Query** (Data fetching)
* **Framer Motion** & **GSAP** for premium animations
* **Lenis** for smooth scroll behaviors

### Backend (`server/`)
* **Node.js** + **Express** + **TypeScript**
* **Prisma ORM** + **MongoDB**
* **Stripe SDK** (Payment processing)
* **Resend** (Email delivery)
* **Cloudinary** + **Multer** (File uploads)
* **Zod** for request validation

---

## ⚙️ Setup & Installation

### 1. Install Dependencies
Run the following command at the **root directory** to install dependencies across all workspaces:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the **[server/](./server)** directory with the following variables:
```env
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="your-mongodb-connection-string"

# Authentication
JWT_SECRET="your-super-secure-jwt-secret"
COOKIE_SECRET="your-cookie-secret"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# Resend Mailer
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="Project Deli <noreply@yourdomain.com>"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# Client URL
CLIENT_URL="http://localhost:5173"
```

### 3. Database Initialization
Generate the Prisma client and push the schema to MongoDB:
```bash
# Generate Prisma Client
npm run prisma:generate -w server

# Sync Schema to MongoDB
npm run prisma:db:push -w server

# Seed initial data (optional)
npm run prisma:seed -w server
```

---

## 🏃 Running the Application

From the root directory, you can run the services using workspace scripts:

### Development Mode
* Start the backend server:
  ```bash
  npm run dev:server
  ```
* Start the frontend client:
  ```bash
  npm run dev:client
  ```

### Production Build
* Build the shared code, server, and client:
  ```bash
  npm run build:all
  ```
* Start the production server:
  ```bash
  npm run start -w server
  ```
