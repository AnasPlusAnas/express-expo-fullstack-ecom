import { Router } from 'express';
import {
  createProduct,
  getProductById,
  listProducts,
  updateProduct,
  deleteProduct,
} from './productsController.js';
import {
  createProductSchema,
  updateProductSchema,
} from '../../db/schema/products.js';
import { validateData } from '../../middlewares/validateData.js';
import {
  verifyIsSeller,
  verifyToken,
} from '../../middlewares/authMiddleware.js';

const productsRouter = Router();

productsRouter.get('/', listProducts);

productsRouter.get('/:id', getProductById);

productsRouter.post(
  '/',
  verifyToken,
  verifyIsSeller,
  validateData(createProductSchema),
  createProduct
);

productsRouter.put(
  '/:id',
  verifyToken,
  verifyIsSeller,
  validateData(updateProductSchema),
  updateProduct
);

productsRouter.delete('/:id', deleteProduct);

export default productsRouter;
