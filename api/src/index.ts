import express, { json } from 'express';
import productsRouter from './routes/products/index.js';
import authRouter from './routes/auth/index.js';
import ordersRouter from './routes/orders/index.js';

const app = express();
const PORT = 3000;

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(json());

// routes
app.use('/products', productsRouter);
app.use('/auth', authRouter);
app.use('/orders', ordersRouter);

if (process.env.NODE_ENV === 'dev') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
