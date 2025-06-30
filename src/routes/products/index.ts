import { Router } from 'express';
import {
  createProduct,
  getProductById,
  listProducts,
  updateProduct,
  deleteProduct,
} from './productsController';
import { validateSchema } from '../../middlewares/validationMiddleware';
import { createProductSchema } from '../../db/schema/products';

const productsRouter = Router();

productsRouter.get('/', listProducts);

productsRouter.get('/:id', getProductById);

productsRouter.post('/', validateSchema(createProductSchema), createProduct);

productsRouter.put('/:id', updateProduct);

productsRouter.delete('/:id', deleteProduct);

export default productsRouter;
