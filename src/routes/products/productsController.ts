import { Request, Response } from 'express';
import { db } from '../../db/index';
import { productsTable } from '../../db/schema/products';
import { eq } from 'drizzle-orm';

export async function createProduct(req: Request, res: Response) {
  try {
    const [products] = await db
      .insert(productsTable)
      .values(req.body)
      .returning();

    res.status(201).json({
      message: 'Product created successfully!',
      product: products,
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function listProducts(req: Request, res: Response) {
  try {
    const products = await db.select().from(productsTable);

    res.json(products);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const [products] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, Number(req.params.id)));

    if (!products) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(products);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updatedFields = req.body;

    const [updatedProduct] = await db
      .update(productsTable)
      .set(updatedFields)
      .where(eq(productsTable.id, id))
      .returning();

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully!',
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const [deleteProduct] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, Number(req.params.id)))
      .returning();

    if (deleteProduct) {
      return res.status(204).json({ message: 'Product not found' });
    }

    res.status(404).send({ message: 'Product not found!' });
  } catch (error) {
    res.status(500).send(error);
  }
}
