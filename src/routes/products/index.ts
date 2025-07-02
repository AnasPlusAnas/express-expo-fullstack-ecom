import { Router } from 'express';
import {
  createProduct,
  getProductById,
  listProducts,
  updateProduct,
  deleteProduct,
} from './productsController';
import {
  validateCreateProduct,
  validateProductId,
  validateUpdateProduct,
} from '../../middlewares/validationMiddleware';

const productsRouter = Router();

productsRouter.get('/', listProducts);

productsRouter.get('/:id', validateProductId, getProductById);

productsRouter.post('/', validateCreateProduct, createProduct);

productsRouter.put('/:id', validateUpdateProduct, updateProduct);

productsRouter.delete('/:id', validateProductId, deleteProduct);

export default productsRouter;
