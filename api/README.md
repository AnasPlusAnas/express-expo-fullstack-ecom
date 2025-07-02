# 🛒 E-Commerce API

A modern, type-safe REST API built with Node.js, Express, and TypeScript for managing an e-commerce platform. Features user authentication, product management, and order processing with a clean, scalable architecture.

## ✨ Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 👥 **Role-based Access Control** - User and seller permissions
- 📦 **Product Management** - CRUD operations for products
- 🛍️ **Order Processing** - Shopping cart and order management
- ✅ **Data Validation** - Input validation with express-validator
- 🗃️ **Type-safe Database** - Drizzle ORM with PostgreSQL
- 🚀 **Cloud Deployment** - Ready for Genezio platform
- 📝 **TypeScript** - Full type safety and excellent DX

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) | Runtime Environment | 20.x |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) | Language | 5.8+ |
| ![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white) | Web Framework | 5.1+ |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white) | Database | Latest |
| ![Drizzle](https://img.shields.io/badge/Drizzle-000000?style=flat&logo=drizzle&logoColor=white) | ORM | 0.44+ |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white) | Authentication | Latest |

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
│   │       ├── 📄 products.ts      # Product schema
│   │       └── 📄 users.ts         # User schema
│   ├── 📁 routes/
│   │   ├── 📁 auth/
│   │   │   ├── 📄 index.ts         # Auth routes
│   │   │   └── 📄 authController.ts # Auth logic
│   │   └── 📁 products/
│   │       ├── 📄 index.ts         # Product routes
│   │       └── 📄 productsController.ts # Product logic
│   └── 📁 middlewares/
│       ├── 📄 authValidationMiddleware.ts    # Auth validation
│       └── 📄 productValidationMiddleware.ts # Product validation
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
| `DELETE` | `/products/:id` | Delete product | Seller only |

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
  role: 'user' | 'seller'
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

## 🔒 Authentication & Authorization

- **JWT tokens** for stateless authentication
- **Role-based access control** (user/seller)
- **Secure password hashing** with bcryptjs
- **Token verification middleware** for protected routes

## 🌐 Deployment

This API is configured for deployment on [Genezio](https://genezio.com/):

```bash
# Deploy to Genezio cloud
genezio deploy
```

The `genezio.yaml` configuration handles:
- ✅ Automatic builds (`npm run build`)
- ✅ PostgreSQL database provisioning
- ✅ Environment variable management
- ✅ Serverless function deployment
