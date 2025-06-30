import { Request, Response } from 'express';

export function listProducts(req: Request, res: Response) {
  res.send('List of products will be here soon!');
}

export function getProductById(req: Request, res: Response) {
  res.send(`product ${req.params.id} details will be here soon!`);
}

export function createProduct(req: Request, res: Response) {
  console.log('Product data:', req.body);

  res.send('Product created successfully!');
}

export function updateProduct(req: Request, res: Response) {
  res.send(`Product ${req.params.id} updated successfully!`);
}

export function deleteProduct(req: Request, res: Response) {
  res.send(`Product ${req.params.id} deleted successfully!`);
}
