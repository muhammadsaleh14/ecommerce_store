import { createSupabaseClient } from '@/lib/supabase-client'
import { productSchema, toProduct } from '../types/product'
import type { Product, ProductInput } from '../types/product'

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await createSupabaseClient()
    .from('products')
    .select('*, product_variants(*)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as unknown as Parameters<typeof toProduct>[0][]).map(toProduct)
}

export const getProduct = async (id: string): Promise<Product> => {
  const { data, error } = await createSupabaseClient()
    .from('products')
    .select('*, product_variants(*)')
    .eq('id', id)
    .single()

  if (error) throw error
  return toProduct(data as unknown as Parameters<typeof toProduct>[0])
}

export const addProduct = async (input: ProductInput) => {
  const parsed = productSchema.parse(input)

  const { data: product, error: productError } = await createSupabaseClient()
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

  const { error: variantError } = await createSupabaseClient()
    .from('product_variants')
    .insert(variants)

  if (variantError) throw variantError
  return product.id
}

export const updateProduct = async (id: string, input: ProductInput) => {
  const parsed = productSchema.parse(input)

  const { error: productError } = await createSupabaseClient()
    .from('products')
    .update({ name: parsed.name, description: parsed.description, category: parsed.category })
    .eq('id', id)

  if (productError) throw productError

  const { error: deleteError } = await createSupabaseClient()
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

  const { error: variantError } = await createSupabaseClient()
    .from('product_variants')
    .insert(variants)

  if (variantError) throw variantError
}

export const deleteProduct = async (id: string) => {
  const { error } = await createSupabaseClient().from('products').delete().eq('id', id)
  if (error) throw error
}
