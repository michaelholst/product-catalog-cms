import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { categories } from '../lib/data/categories'
import { products } from '../lib/data/products'

// Create Prisma adapter for LibSQL/SQLite
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting database seed...')

  // Clear existing data
  console.log('Clearing existing data...')
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // Seed categories
  console.log('Seeding categories...')
  for (const category of categories) {
    await prisma.category.create({
      data: {
        id: category.id,
        slug: category.slug,
        name: category.name,
        description: category.description,
        image: category.image,
        parentId: category.parentId,
        productCount: category.productCount,
      },
    })
  }
  console.log(`✓ Seeded ${categories.length} categories`)

  // Seed products
  console.log('Seeding products...')
  for (const product of products) {
    await prisma.product.create({
      data: {
        id: product.id,
        slug: product.slug,
        sku: product.sku,
        name: product.name,
        description: product.description,
        longDescription: product.longDescription,
        price: product.price,
        originalPrice: product.originalPrice,
        currency: product.currency,
        category: product.category,
        subcategory: product.subcategory,
        tags: JSON.stringify(product.tags),
        inStock: product.inventory.inStock,
        quantity: product.inventory.quantity,
        lowStockThreshold: product.inventory.lowStockThreshold,
        reservedQuantity: product.inventory.reservedQuantity,
        images: JSON.stringify(product.images),
        featured: product.featured,
        isNew: product.isNew,
        ratingAverage: product.rating?.average,
        ratingCount: product.rating?.count,
        attributes: JSON.stringify(product.attributes),
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        publishedAt: product.publishedAt,
      },
    })
  }
  console.log(`✓ Seeded ${products.length} products`)

  console.log('✓ Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
