import express from 'express';
import prisma from './prisma';

const app = express();
app.use(express.json());

app.get('/api/v1/products', async (_req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
