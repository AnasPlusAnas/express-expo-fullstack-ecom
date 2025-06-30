# Express Router vs Direct App Routing

## What's the Difference?

## Method 1: Direct App Routing (Without Router)

```typescript
// Creating endpoints directly on the app object
app.get('/', (req, res) => {
  res.send('Hello, Wowwwrld!');
});

app.get('/products', (req, res) => {
  res.send('List of products will be here soon!');
});

app.get('/products/:id', (req, res) => {
  res.send(`product ${req.params.id} details will be here soon!`);
});

app.post('/products', (req, res) => {
  res.send('Product created successfully!');
});
```

### How it works:
- I define routes **directly** on the main `app` object
- Each route has the **full path** written out (`/products`, `/products/:id`)
- Simple and straightforward for small applications

### URLs created:
- `GET http://localhost:3000/`
- `GET http://localhost:3000/products`
- `GET http://localhost:3000/products/:id`
- `POST http://localhost:3000/products`

---

## Method 2: Using Express Router

```typescript
// Creating a separate router instance
const router = Router();

// Define routes on the router (notice the shorter paths!)
router.get('/', (req, res) => {  
  res.send('List of products will be here soon!');
});

router.get('/:id', (req, res) => {
  res.send(`product ${req.params.id} details will be here soon!`);
});

router.post('/', (req, res) => {
  res.send('Product created successfully!');
});

// Mount the router to a base path
app.use('/products', router);
```

### How it works:
- I create a **separate router instance** using `Router()`
- Define routes on the router with **relative paths** (`/`, `/:id` instead of `/products`, `/products/:id`)
- **Mount** the entire router to a base path using `app.use('/products', router)`
- All router routes get **prefixed** with `/products`

### URLs created:
- `GET http://localhost:3000/products/` (from `router.get('/')`)
- `GET http://localhost:3000/products/:id` (from `router.get('/:id')`)
- `POST http://localhost:3000/products/` (from `router.post('/')`)

---

## Real-World Example: Why Router is Better for Organization

If I had a large e-commerce API:

### Without Router (gets messy quickly):
```typescript
// All in one file - hard to manage!
app.get('/products', getProducts);
app.get('/products/:id', getProduct);
app.post('/products', createProduct);
app.put('/products/:id', updateProduct);
app.delete('/products/:id', deleteProduct);

app.get('/users', getUsers);
app.get('/users/:id', getUser);
app.post('/users', createUser);
app.put('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);

app.get('/orders', getOrders);
// ... and so on
```

### With Router (clean and organized):
```typescript
// products.ts
const productRouter = Router();
productRouter.get('/', getProducts);
productRouter.get('/:id', getProduct);
productRouter.post('/', createProduct);
// ... export productRouter

// users.ts  
const userRouter = Router();
userRouter.get('/', getUsers);
// ... export userRouter

// main app.ts
app.use('/products', productRouter);
app.use('/users', userRouter);
app.use('/orders', orderRouter);
```

---

## Key Takeaways:

1. **Both methods create the same endpoints** - it's about organization
2. **Router allows me to group related routes** together
3. **Router paths are relative** to where I mount them
4. **I need to fix the duplicate routes** in my router section
5. **I should start with direct routing** while learning, then move to Router as my app grows
