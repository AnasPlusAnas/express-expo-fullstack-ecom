import { Router } from 'express';
import {
  createProduct,
  getProductById,
  listProducts,
  updateProduct,
  deleteProduct,
} from './productsController';

const productsRouter = Router();

productsRouter.get('/', listProducts);

productsRouter.get('/:id', getProductById);

productsRouter.post('/', createProduct);

productsRouter.put('/:id', updateProduct);

productsRouter.delete('/:id', deleteProduct);

export default productsRouter;
