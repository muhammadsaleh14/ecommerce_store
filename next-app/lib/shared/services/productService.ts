import type { SupabaseClient } from "@supabase/supabase-js";
import { productSchema, toProduct } from "../types/product";
import type { Product, ProductInput } from "../types/product";

export const getProducts = async (
  client: SupabaseClient,
  tenantId: string,
  limit?: number,
): Promise<Product[]> => {
  let query = client
    .from("products")
    .select("*, product_variants(*)")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;

  if (error) throw error;
  return (data ?? []).map((row) =>
    toProduct(row as Parameters<typeof toProduct>[0]),
  );
};

export const getProduct = async (
  client: SupabaseClient,
  tenantId: string,
  id: string,
): Promise<Product> => {
  const { data, error } = await client
    .from("products")
    .select("*, product_variants(*)")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .single();

  if (error) throw error;
  return toProduct(data as unknown as Parameters<typeof toProduct>[0]);
};

export const addProduct = async (
  client: SupabaseClient,
  tenantId: string,
  input: ProductInput,
) => {
  const parsed = productSchema.parse(input);

  const { data: product, error: productError } = await client
    .from("products")
    .insert({
      name: parsed.name,
      description: parsed.description,
      category: parsed.category,
      tenant_id: tenantId,
    })
    .select()
    .single();

  if (productError) throw productError;

  const variants = parsed.variants.map((v) => ({
    product_id: product.id,
    name: v.name,
    price: v.price,
    image_url: v.imageUrl,
  }));

  const { error: variantError } = await client
    .from("product_variants")
    .insert(variants);

  if (variantError) throw variantError;
  return product.id;
};

export const updateProduct = async (
  client: SupabaseClient,
  tenantId: string,
  id: string,
  input: ProductInput,
) => {
  const parsed = productSchema.parse(input);

  const { error: productError } = await client
    .from("products")
    .update({
      name: parsed.name,
      description: parsed.description,
      category: parsed.category,
    })
    .eq("tenant_id", tenantId)
    .eq("id", id);

  if (productError) throw productError;

  const { error: deleteError } = await client
    .from("product_variants")
    .delete()
    .eq("product_id", id);

  if (deleteError) throw deleteError;

  const variants = parsed.variants.map((v) => ({
    product_id: id,
    name: v.name,
    price: v.price,
    image_url: v.imageUrl,
  }));

  const { error: variantError } = await client
    .from("product_variants")
    .insert(variants);

  if (variantError) throw variantError;
};

export const deleteProduct = async (
  client: SupabaseClient,
  tenantId: string,
  id: string,
) => {
  const { error } = await client
    .from("products")
    .delete()
    .eq("tenant_id", tenantId)
    .eq("id", id);
  if (error) throw error;
};
