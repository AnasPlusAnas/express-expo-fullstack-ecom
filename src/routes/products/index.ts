import { Router } from 'express';

const productsRouter = Router();

productsRouter.get('/', (req, res) => {
  res.send('List of products will be here soon!');
});

productsRouter.get('/:id', (req, res) => {
  res.send(`product ${req.params.id} details will be here soon!`);
});

productsRouter.post('/', (req, res) => {
  res.send('Product created successfully!');
});

export default productsRouter;
