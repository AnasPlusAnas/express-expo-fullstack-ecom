import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
} from './ordersController.js';
import {
  createOrderWithItemsSchema,
  updateOrderSchema,
} from '../../db/schema/orders.js';
import { validateData } from '../../middlewares/validateData.js';
import {
  verifyIsSeller,
  verifyToken,
} from '../../middlewares/authMiddleware.js';

const ordersRouter = Router();

ordersRouter.post(
  '/',
  verifyToken,
  validateData(createOrderWithItemsSchema),
  createOrder
);

ordersRouter.get('/', verifyToken, listOrders);

ordersRouter.get('/:id', verifyToken, getOrderById);

ordersRouter.put(
  '/:id',
  verifyToken,
  validateData(updateOrderSchema),
  updateOrder
);

export default ordersRouter;
