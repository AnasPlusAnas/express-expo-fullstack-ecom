# Drizzle ORM Setup - My Learning Notes

## What is Drizzle ORM?

Drizzle is a TypeScript ORM (Object-Relational Mapping) that I'm using to interact with my PostgreSQL database. It's type-safe, lightweight, and gives me great developer experience with autocompletion and compile-time error checking.

## My Project Structure

```
src/
├── db/
│   ├── index.ts           # Database connection
│   └── schema/
│       └── products.ts    # Product table schema
drizzle.config.ts          # Drizzle configuration
```

## Configuration Files

### 1. Drizzle Config (`drizzle.config.ts`)

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',              // Where migration files go
  schema: './src/db/schema',     // Where my schema files are
  dialect: 'postgresql',         // Database type I'm using
  dbCredentials: {
    url: process.env.DATABASE_URL!,  // Connection string from .env
  },
  verbose: true,                 // Show detailed logs
  strict: true,                  // Strict mode for safety
});
```

**What each setting does:**
- **`out`**: Directory where Drizzle generates migration files
- **`schema`**: Where I define my database tables
- **`dialect`**: Tells Drizzle I'm using PostgreSQL
- **`dbCredentials`**: How to connect to my database
- **`verbose`**: Shows me what's happening during operations
- **`strict`**: Extra safety checks

### 2. Database Connection (`src/db/index.ts`)

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Create connection pool to PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Drizzle instance with the pool
export const db = drizzle(pool);
```

**How it works:**
- **Pool**: Manages multiple database connections efficiently
- **drizzle()**: Creates the ORM instance I use in my controllers
- **process.env.DATABASE_URL**: Connection string from my `.env` file

### 3. Schema Definition (`src/db/schema/products.ts`)

```typescript
import {
  pgTable,
  integer,
  varchar,
  text,
  doublePrecision,
} from 'drizzle-orm/pg-core';

export const productsTable = pgTable('products', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  image: varchar({ length: 255 }),
  price: doublePrecision().notNull(),
  quantity: integer().default(0),
});
```

**Column breakdown:**
- **`id`**: Auto-incrementing primary key (PostgreSQL IDENTITY)
- **`name`**: Required string up to 255 characters
- **`description`**: Optional unlimited text
- **`image`**: Optional string for image URL/path
- **`price`**: Required decimal number (for money)
- **`quantity`**: Integer with default value of 0

## Package.json Scripts

I have several helpful scripts for managing my database:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",  // Create migration files
    "db:migrate": "drizzle-kit migrate",    // Apply migrations to DB
    "db:push": "drizzle-kit push",          // Push schema directly (dev)
    "db:studio": "drizzle-kit studio"       // Open visual DB browser
  }
}
```

### What each script does:

- **`npm run db:generate`**: Creates migration files when I change my schema
- **`npm run db:migrate`**: Applies pending migrations to my database
- **`npm run db:push`**: Pushes schema changes directly (good for development)
- **`npm run db:studio`**: Opens a web interface to browse my database

## My Development Workflow

### 1. **First Time Setup**
```bash
# Set up environment variable
echo "DATABASE_URL=postgresql://user:password@localhost:5432/mydb" > .env

# Push initial schema to database
npm run db:push
```

### 2. **When I Change Schema**
```bash
# Option A: For development (quick and easy)
npm run db:push

# Option B: For production (proper migrations)
npm run db:generate  # Creates migration file
npm run db:migrate   # Applies it to database
```

### 3. **View My Data**
```bash
npm run db:studio
# Opens http://localhost:4983 to browse my database
```

## Using Drizzle in My Controllers

Here's how I would use the database in my controllers:

```typescript
import { db } from '../db/index.js';
import { productsTable } from '../db/schema/products.js';
import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';

// Get all products
export async function listProducts(req: Request, res: Response) {
  try {
    const products = await db.select().from(productsTable);
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error' });
  }
}

// Get product by ID
export async function getProductById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const product = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));
    
    if (product.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, data: product[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error' });
  }
}

// Create new product
export async function createProduct(req: Request, res: Response) {
  try {
    const { name, description, image, price, quantity } = req.body;
    
    const newProduct = await db
      .insert(productsTable)
      .values({ name, description, image, price, quantity })
      .returning();
    
    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error' });
  }
}

// Update product
export async function updateProduct(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const { name, description, image, price, quantity } = req.body;
    
    const updatedProduct = await db
      .update(productsTable)
      .set({ name, description, image, price, quantity })
      .where(eq(productsTable.id, id))
      .returning();
    
    if (updatedProduct.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, data: updatedProduct[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error' });
  }
}

// Delete product
export async function deleteProduct(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    
    const deletedProduct = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning();
    
    if (deletedProduct.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database error' });
  }
}
```

## Key Drizzle Concepts

### 1. **Query Builder**
```typescript
// Select all
await db.select().from(productsTable);

// Select specific columns
await db.select({ name: productsTable.name, price: productsTable.price }).from(productsTable);

// With conditions
await db.select().from(productsTable).where(eq(productsTable.price, 100));
```

### 2. **Insert Operations**
```typescript
// Insert single record
await db.insert(productsTable).values({ name: 'Laptop', price: 999 });

// Insert multiple records
await db.insert(productsTable).values([
  { name: 'Laptop', price: 999 },
  { name: 'Phone', price: 599 }
]);

// Insert and return the created record
await db.insert(productsTable).values({ name: 'Laptop', price: 999 }).returning();
```

### 3. **Update Operations**
```typescript
await db
  .update(productsTable)
  .set({ price: 899 })
  .where(eq(productsTable.id, 1));
```

### 4. **Delete Operations**
```typescript
await db
  .delete(productsTable)
  .where(eq(productsTable.id, 1));
```

## Environment Variables

I need this in my `.env` file:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

## Benefits of My Setup

### 1. **Type Safety**
- TypeScript knows exactly what columns exist
- Autocomplete for table and column names
- Compile-time error checking

### 2. **Schema as Code**
- My database schema is version controlled
- Easy to see changes over time
- Can recreate database from code

### 3. **Migration System**
- Safe database changes
- Can rollback if needed
- Production-ready deployment process

### 4. **Developer Experience**
- Drizzle Studio for visual database browsing
- Great debugging with verbose logging
- Modern async/await syntax

## Common Commands I Use

```bash
# Development workflow
npm run db:push          # Quick schema changes
npm run db:studio        # Browse database

# Production workflow  
npm run db:generate      # Create migration
npm run db:migrate       # Apply migration

# Check what's happening
npm run dev              # Start my API server
```

## Key Takeaways

- **Drizzle gives me type-safe database operations**
- **Schema is defined in TypeScript, not SQL**
- **Migrations keep database changes organized**
- **The query builder is intuitive and powerful**
- **Everything is async and returns Promises**

Drizzle makes working with databases feel like working with TypeScript objects - it's the perfect bridge between my code and my data!
