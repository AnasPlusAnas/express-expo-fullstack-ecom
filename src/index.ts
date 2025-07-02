import express, { json } from 'express';
import productsRouter from './routes/products';
import authRouter from './routes/auth';

const app = express();
const PORT = 3000;

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(json());

// routes
app.use('/products', productsRouter);
app.use('/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
