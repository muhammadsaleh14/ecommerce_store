import { getSupabase } from '../supabase'
import { productSchema, CATEGORIES } from '../types/product'
import type { Product, ProductInput, Category } from '../types/product'
import type { SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null
function db(): SupabaseClient {
  if (!_supabase) _supabase = getSupabase()
  return _supabase
}

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

function toProduct(row: DbProduct): Product {
  return {
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
  }
}

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await db()
    .from('products')
    .select('*, product_variants(*)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as DbProduct[]).map(toProduct)
}

export const getProduct = async (id: string): Promise<Product> => {
  const { data, error } = await db()
    .from('products')
    .select('*, product_variants(*)')
    .eq('id', id)
    .single()

  if (error) throw error
  return toProduct(data as unknown as DbProduct)
}

export const addProduct = async (input: ProductInput) => {
  const parsed = productSchema.parse(input)

  const { data: product, error: productError } = await db()
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

  const { error: variantError } = await db()
    .from('product_variants')
    .insert(variants)

  if (variantError) throw variantError
  return product.id
}

export const updateProduct = async (id: string, input: ProductInput) => {
  const parsed = productSchema.parse(input)

  const { error: productError } = await db()
    .from('products')
    .update({ name: parsed.name, description: parsed.description, category: parsed.category })
    .eq('id', id)

  if (productError) throw productError

  const { error: deleteError } = await db()
    .from('product_variants')
    .delete()
    .eq('product_id', id)

  if (deleteError) throw deleteError

  const variants = parsed.variants.map((v) => ({
    product_id: id,
    name: v.name,
    price: v.price,
    image_url: v.imageUrl,
  }))

  const { error: variantError } = await db()
    .from('product_variants')
    .insert(variants)

  if (variantError) throw variantError
}

export const deleteProduct = async (id: string) => {
  const { error } = await db().from('products').delete().eq('id', id)
  if (error) throw error
}
