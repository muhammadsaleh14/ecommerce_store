import { getSupabaseClient } from '@/lib/supabase/client'

const BUCKET = 'product-images'

export async function uploadVariantImage(file: File): Promise<string> {
  const supabase = getSupabaseClient()
  const ext = file.name.split('.').pop()
  const path = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
  })
  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function deleteStorageImage(publicUrl: string): Promise<void> {
  if (!publicUrl) return

  const supabase = getSupabaseClient()
  const bucketUrl = supabase.storage.from(BUCKET).getPublicUrl('').data.publicUrl

  if (!publicUrl.startsWith(bucketUrl)) return

  const path = publicUrl.slice(bucketUrl.length)
  if (!path) return

  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw error
}
