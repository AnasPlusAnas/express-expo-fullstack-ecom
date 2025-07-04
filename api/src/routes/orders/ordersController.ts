import { Request, Response } from 'express';
import { db } from '../../db/index.js';
import _ from 'lodash';
import { eq, inArray } from 'drizzle-orm';
import { orderItemsTable, ordersTable } from '../../db/schema/orders.js';
import { productsTable } from '../../db/schema/products.js';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { order, items } = req.cleanBody;
    const userId = req.userId!;

    const [newOrder] = await db
      .insert(ordersTable)
      .values({ userId })
      .returning();

    // validate product ids, and take the actual price from products table
    const productIds = items.map((item: any) => item.productId);
    await Promise.all(
      productIds.map(async (id: number) => {
        // get the product price from the products table
        const [product] = await db
          .select({ id: productsTable.id, price: productsTable.price })
          .from(productsTable)
          .where(eq(productsTable.id, id));

        // update the item price with the actual product price
        const item = items.find((item: any) => item.productId === product.id);
        item.price = product.price * item.quantity;
      })
    );

    const orderItems = items.map((item: any) => ({
      ...item,
      orderId: newOrder.id,
    }));

    const newOrderItems = await db
      .insert(orderItemsTable)
      .values(orderItems)
      .returning();

    res.status(200).json({ ...newOrder, items: newOrderItems });
  } catch (error) {
    res.status(500).json({
      errors: [
        {
          type: 'server',
          value: null,
          msg: error || 'Failed to create product',
          path: 'server',
          location: 'internal',
        },
      ],
    });
  }
};

export const listOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;

    // get all orders for the user
    const orders = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.userId, userId));

    // get all order items for the orders
    const orderIds = orders.map((order) => order.id);
    const orderItems = await db
      .select()
      .from(orderItemsTable)
      .where(inArray(orderItemsTable.orderId, orderIds));

    res.status(200).json(
      orders.map((order) => ({
        ...order,
        items: orderItems.filter((item) => item.orderId === order.id),
      }))
    );
  } catch (error) {
    res.status(500).json({
      errors: [
        {
          type: 'server',
          value: null,
          msg: error || 'Failed to create product',
          path: 'server',
          location: 'internal',
        },
      ],
    });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const orderWithItems = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, id))
      .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId));

    if (_.isEmpty(orderWithItems)) {
      res.status(404).json({
        errors: [
          {
            type: 'not_found',
            value: null,
            msg: 'Order not found',
          },
        ],
      });
    }

    // merge order and items
    const mergedOrder = {
      ...orderWithItems[0].orders,
      items: orderWithItems.map((oi) => oi.order_items),
    };

    res.status(200).json(mergedOrder);
  } catch (error) {
    res.status(500).json({
      errors: [
        {
          type: 'server',
          value: null,
          msg: error || 'Failed to get order',
        },
      ],
    });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const [updatedOrder] = await db
      .update(ordersTable)
      .set(req.cleanBody)
      .where(eq(ordersTable.id, id))
      .returning();
    if (!updatedOrder) {
      res.status(404).json({
        errors: [
          {
            type: 'not_found',
            value: null,
            msg: 'Order not found',
          },
        ],
      });
      return;
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      errors: [
        {
          type: 'server',
          value: null,
          msg: error || 'Failed to get order',
        },
      ],
    });
  }
};
