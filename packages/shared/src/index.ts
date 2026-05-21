export { db, auth } from './firebase'
export { productSchema } from './types/product'
export type { Product, ProductInput } from './types/product'
export { getProducts, addProduct, deleteProduct } from './services/productService'
