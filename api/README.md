# 🛒 E-Commerce API

A type-safe REST API built with Node.js, Express, and TypeScript for managing an e-commerce platform. Features user authentication, product management, and order processing with a clean, scalable architecture.

## ✨ Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 👥 **Role-based Access Control** - User and seller permissions
- 📦 **Product Management** - CRUD operations for products
- 🛍️ **Order Processing** - Complete shopping cart and order management
- 📋 **Order Items** - Detailed order line items with product references
- ✅ **Data Validation** - Input validation with Zod schemas
- 🗃️ **Type-safe Database** - Drizzle ORM with PostgreSQL
- 🚀 **Cloud Deployment** - Ready for Genezio platform
- 📝 **TypeScript** - Full type safety and excellent DX
- 🔧 **Clean Architecture** - Middleware-based validation and authentication

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) | Runtime Environment | 20.x |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) | Language | 5.8+ |
| ![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white) | Web Framework | 5.1+ |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white) | Database | Latest |
| ![Drizzle](https://img.shields.io/badge/Drizzle-000000?style=flat&logo=drizzle&logoColor=white) | ORM | 0.44+ |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white) | Authentication | Latest |
| ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat&logo=zod&logoColor=white) | Schema Validation | Latest |
| ![bcryptjs](https://img.shields.io/badge/bcryptjs-FF6B6B?style=flat&logo=lock&logoColor=white) | Password Hashing | Latest |

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL database
- pnpm/npm/yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd api
   npm install
   ```

2. **Set up environment variables**
   create a `.env` file in the root `api` folder.

   Update `.env` with your database URL and JWT secret:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   JWT_SECRET=your-super-secret-key
   NODE_ENV=dev
   ```

3. **Set up the database**
   ```bash
   # run migrations
   npm run db:migrate
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000` 🎉

## 📁 Project Structure

```
api/
├── 📁 src/
│   ├── 📄 index.ts                 # App entry point
│   ├── 📁 db/
│   │   ├── 📄 index.ts             # Database connection
│   │   └── 📁 schema/
│   │       ├── 📄 products.ts      # Product schema & validation
│   │       ├── 📄 users.ts         # User schema & validation
│   │       └── 📄 orders.ts        # Orders & order items schema
│   ├── 📁 routes/
│   │   ├── 📁 auth/
│   │   │   ├── 📄 index.ts         # Auth routes
│   │   │   └── 📄 authController.ts # Auth logic
│   │   ├── 📁 products/
│   │   │   ├── 📄 index.ts         # Product routes
│   │   │   └── 📄 productsController.ts # Product logic
│   │   └── 📁 orders/
│   │       ├── 📄 index.ts         # Order routes
│   │       └── 📄 ordersController.ts # Order logic
│   └── 📁 middlewares/
│       ├── 📄 authMiddleware.ts    # Auth & role validation
│       └── 📄 validateData.ts      # Zod schema validation
├── 📁 types/
│   └── 📁 express/
│       └── 📄 index.d.ts           # Express type extensions
├── 📁 drizzle/                     # Database migrations
├── 📄 drizzle.config.ts            # Drizzle configuration
├── 📄 genezio.yaml                 # Deployment config
└── 📄 package.json
```

## 🔌 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/auth/register` | Register new user | Public |
| `POST` | `/auth/login` | User login | Public |

### 📦 Products

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/products` | List all products | Public |
| `GET` | `/products/:id` | Get product by ID | Public |
| `POST` | `/products` | Create new product | Seller only |
| `PUT` | `/products/:id` | Update product | Seller only |
| `DELETE` | `/products/:id` | Delete product | Public |

### 🛍️ Orders

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/orders` | List user's orders | Authenticated |
| `GET` | `/orders/:id` | Get order by ID | Authenticated |
| `POST` | `/orders` | Create new order | Authenticated |
| `PUT` | `/orders/:id` | Update order status | Authenticated |

## 📝 API Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "address": "123 Main St"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Create a product (requires seller role)
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Awesome Laptop",
    "description": "High-performance laptop for developers",
    "price": 999.99,
    "quantity": 10,
    "image": "https://example.com/laptop.jpg"
  }'
```

### Create an order
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "order": {},
    "items": [
      {
        "productId": 1,
        "quantity": 2
      },
      {
        "productId": 2,
        "quantity": 1
      }
    ]
  }'
```

## 🛠️ Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run db:generate` | Generate database migrations |
| `npm run db:migrate` | Apply database migrations |
| `npm run db:push` | Push schema changes to database |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |

## 🏗️ Database Schema

### Users Table
```typescript
{
  id: number (auto-increment)
  email: string (unique)
  password: string (hashed)
  role: 'user' | 'seller' (default: 'user')
  name: string
  address?: string
}
```

### Products Table
```typescript
{
  id: number (auto-increment)
  name: string
  description?: string
  image?: string
  price: number
  quantity: number (default: 0)
}
```

### Orders Table
```typescript
{
  id: number (auto-increment)
  createdAt: timestamp (default: now())
  status: string (default: 'new')
  userId: number (foreign key to users)
}
```

### Order Items Table
```typescript
{
  id: number (auto-increment)
  orderId: number (foreign key to orders)
  productId: number (foreign key to products)
  quantity: number
  price: number (calculated from product price)
}
```

## 🔒 Authentication & Authorization

- **JWT tokens** for stateless authentication with 30-day expiration
- **Role-based access control** (user/seller)
- **Secure password hashing** with bcryptjs
- **Token verification middleware** for protected routes
- **Role-specific middleware** for seller-only operations

## 🛡️ Data Validation

- **Zod schemas** for request validation
- **Type-safe validation** with automatic TypeScript inference
- **Clean body middleware** that filters out unwanted fields
- **Comprehensive error handling** with detailed error messages

## 🏪 Order Management

- **Complete order processing** with order headers and line items
- **Automatic price calculation** from current product prices
- **Order status tracking** (new, processing, shipped, delivered)
- **User-specific order history**
- **Detailed order items** with product references

## 🌐 Deployment

This API is configured for deployment on [Genezio](https://genezio.com/):

```bash
# Deploy to Genezio cloud
genezio deploy
```

The [`genezio.yaml`](genezio.yaml) configuration handles:
- ✅ Automatic builds (`npm run build`)
- ✅ PostgreSQL database provisioning
- ✅ Environment variable management
- ✅ Serverless function deployment
- ✅ Node.js 20.x runtime

## 📊 Database Migrations

The project uses Drizzle migrations for database schema management:

- **Migration files** in [`drizzle/`](drizzle/) directory
- **Schema snapshots** for version tracking
- **Automatic migration generation** based on schema changes
- **Production-ready migration system**

## 🔧 Middleware Architecture

- **Authentication middleware** ([`authMiddleware.ts`](src/middlewares/authMiddleware.ts))
  - Token verification
  - Role-based access control
- **Data validation middleware** ([`validateData.ts`](src/middlewares/validateData.ts))
  - Zod schema validation
  - Request body sanitization
- **Custom Express types** ([`types/express/index.d.ts`](types/express/index.d.ts))
  - Extended Request interface
  - Type-safe middleware integration
