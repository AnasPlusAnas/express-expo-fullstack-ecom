import { Request, Response } from 'express';
import { db } from '../../db/index';
import { productsTable } from '../../db/schema/products';
import { eq } from 'drizzle-orm';

export async function createProduct(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { name, description, image, price, quantity } = req.body;
    const productData = { name, description, image, price, quantity };

    const [products] = await db
      .insert(productsTable)
      .values(productData)
      .returning();

    res.status(201).json({
      message: 'Product created successfully!',
      product: products,
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function listProducts(req: Request, res: Response): Promise<void> {
  try {
    const products = await db.select().from(productsTable);

    res.json(products);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function getProductById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const [products] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, Number(req.params.id)));

    if (!products) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json(products);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function updateProduct(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const updatedFields = req.body;

    const [updatedProduct] = await db
      .update(productsTable)
      .set(updatedFields)
      .where(eq(productsTable.id, id))
      .returning();

    if (!updatedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json({
      message: 'Product updated successfully!',
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function deleteProduct(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const [deletedProduct] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, Number(req.params.id)))
      .returning();

    if (!deletedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
}
