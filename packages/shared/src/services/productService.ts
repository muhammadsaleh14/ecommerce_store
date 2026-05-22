import { supabase } from '../supabase'
import { productSchema, CATEGORIES } from '../types/product'
import type { Product, ProductInput, Category } from '../types/product'

interface DbVariant {
  id: string
  product_id: string
  name: string
  price: number
  image_url: string
}

interface DbProduct {
  id: string
  name: string
  description: string
  category: string
  created_at: string
  updated_at: string
  product_variants: DbVariant[]
}

function mapCategory(cat: string): Category {
  return (CATEGORIES as readonly string[]).includes(cat) ? (cat as Category) : 'other'
}

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data as DbProduct[]).map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    category: mapCategory(row.category),
    variants: row.product_variants.map((v) => ({
      name: v.name,
      price: v.price,
      imageUrl: v.image_url,
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}

export const addProduct = async (input: ProductInput) => {
  const parsed = productSchema.parse(input)

  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({ name: parsed.name, description: parsed.description, category: parsed.category })
    .select()
    .single()

  if (productError) throw productError

  const variants = parsed.variants.map((v) => ({
    product_id: product.id,
    name: v.name,
    price: v.price,
    image_url: v.imageUrl,
  }))

  const { error: variantError } = await supabase
    .from('product_variants')
    .insert(variants)

  if (variantError) throw variantError

  return product.id
}

export const deleteProduct = async (id: string) => {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}
