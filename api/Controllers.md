# Express Controllers

## What Are Controllers?

Controllers are functions that handle the actual business logic for my API endpoints. Instead of writing all the logic directly in my route handlers, I separate the logic into dedicated controller functions. This makes my code more organized and reusable.

## My Controller Structure

In my `productsController.ts` file, I have separate functions for each operation:

```typescript
import { Request, Response } from 'express';

// GET /products - List all products
export function listProducts(req: Request, res: Response) {
  res.send('List of products will be here soon!');
}

// GET /products/:id - Get a single product by ID
export function getProductById(req: Request, res: Response) {
  res.send(`product ${req.params.id} details will be here soon!`);
}

// POST /products - Create a new product
export function createProduct(req: Request, res: Response) {
  console.log('Product data:', req.body);
  res.send('Product created successfully!');
}

// PUT /products/:id - Update an existing product
export function updateProduct(req: Request, res: Response) {
  res.send(`Product ${req.params.id} updated successfully!`);
}

// DELETE /products/:id - Delete a product
export function deleteProduct(req: Request, res: Response) {
  res.send(`Product ${req.params.id} deleted successfully!`);
}
```

## How Controllers Work

### 1. **Separation of Concerns**
- **Routes** define WHAT endpoints exist (`/products`, `/products/:id`)
- **Controllers** define HOW to handle those endpoints (the actual logic)
- This keeps my route files clean and focused

### 2. **Function Parameters**
Each controller function receives:
- **`req: Request`** - Contains all info about the incoming HTTP request
  - `req.params` - URL parameters (like `:id`)
  - `req.body` - Data sent in POST/PUT requests
  - `req.query` - Query string parameters (`?name=value`)
  - `req.headers` - HTTP headers
- **`res: Response`** - Used to send responses back to the client
  - `res.send()` - Send a simple response
  - `res.json()` - Send JSON data
  - `res.status()` - Set HTTP status code

### 3. **TypeScript Types**
I import `Request` and `Response` types from Express to get:
- **Autocomplete** in my editor
- **Type checking** to catch errors early
- **Better documentation** of what each parameter contains

## Before vs After Controllers

### Without Controllers (messy routes):
```typescript
// All logic mixed with routing - hard to maintain
app.get('/products', (req, res) => {
  // Lots of business logic here...
  // Database queries...
  // Data validation...
  res.json(products);
});

app.post('/products', (req, res) => {
  // More business logic...
  // Validation...
  // Database operations...
  res.json(newProduct);
});
```

### With Controllers (clean separation):
```typescript
// Routes file - clean and focused
import { listProducts, createProduct } from './productsController';

app.get('/products', listProducts);
app.post('/products', createProduct);

// Controller file - business logic separated
export function listProducts(req: Request, res: Response) {
  // All the business logic here
}

export function createProduct(req: Request, res: Response) {
  // All the creation logic here
}
```

## Real-World Controller Example

Here's what a more complete controller might look like:

```typescript
import { Request, Response } from 'express';

// In a real app, this would be a database
const products = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Phone', price: 599 }
];

export function listProducts(req: Request, res: Response) {
  try {
    // In real app: fetch from database
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
}

export function getProductById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
}

export function createProduct(req: Request, res: Response) {
  try {
    const { name, price } = req.body;
    
    // Validation
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      });
    }
    
    // Create new product
    const newProduct = {
      id: products.length + 1,
      name,
      price: parseFloat(price)
    };
    
    products.push(newProduct);
    
    res.status(201).json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
}
```

## Benefits of Using Controllers

### 1. **Organization**
- Each operation has its own function
- Easy to find and modify specific functionality
- Code is more readable and maintainable

### 2. **Reusability**
- I can use the same controller function in multiple routes
- Easy to test individual functions
- Can be imported and used elsewhere

### 3. **Scalability**
- As my app grows, I can easily add more controller functions
- Can split controllers into multiple files by feature
- Easy to add middleware, validation, etc.

### 4. **Testing**
- I can test controller functions independently
- Easier to mock request/response objects
- More focused unit tests

## Key Takeaways

- **Controllers separate business logic from routing**
- **Each controller function handles one specific operation**
- **TypeScript types help with development and error prevention**
- **Controllers make code more organized, testable, and maintainable**
- **They're the foundation for building scalable APIs**

Controllers are like having specialized workers for each task - instead of one person doing everything, each controller function has one job and does it well!
