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
} from '../../middlewares/productValidationMiddleware';
import {
  verifyIsSeller,
  verifyToken,
} from '../../middlewares/authValidationMiddleware';

const productsRouter = Router();

productsRouter.get('/', listProducts);

productsRouter.get('/:id', validateProductId, getProductById);

productsRouter.post(
  '/',
  verifyToken,
  verifyIsSeller,
  validateCreateProduct,
  createProduct
);

productsRouter.put(
  '/:id',
  verifyToken,
  verifyIsSeller,
  validateUpdateProduct,
  updateProduct
);

productsRouter.delete(
  '/:id',
  verifyToken,
  verifyIsSeller,
  validateProductId,
  deleteProduct
);

export default productsRouter;
