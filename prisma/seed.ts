import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      password: 'password',
      name: 'Demo User',
    },
  });

  const store = await prisma.store.create({
    data: {
      userId: user.id,
      ebayUserName: 'demo_store',
      ebayStoreId: 'store123',
      accessToken: 'access',
      refreshToken: 'refresh',
      tokenExpiresAt: new Date(Date.now() + 3600 * 1000),
    },
  });

  const product = await prisma.product.create({
    data: {
      storeId: store.id,
      listingId: 'listing123',
      title: 'Demo Product',
      sku: 'SKU123',
      itemPrice: 10,
      shippingPrice: 2,
      totalPrice: 12,
    },
  });

  await prisma.competitor.create({
    data: {
      productId: product.id,
      listingId: 'competitor123',
      seller: 'comp_seller',
      itemPrice: 11,
      shippingPrice: 1,
      totalPrice: 12,
      status: 'APPROVED',
    },
  });

  console.log('Seed data created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
