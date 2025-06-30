import express, { json } from 'express';
import productsRouter from './routes/products';

const app = express();
const PORT = 3000;

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(json());

// routes
app.use('/products', productsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
