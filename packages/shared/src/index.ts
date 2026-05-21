export { db, auth } from './firebase'
export { productSchema, CATEGORIES } from './types/product'
export type { Product, ProductInput, Category, ProductVariant } from './types/product'
export { getProducts, addProduct, deleteProduct } from './services/productService'
