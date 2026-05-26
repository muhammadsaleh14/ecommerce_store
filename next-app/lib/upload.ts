import { supabase } from '@/lib/supabase/client'

const BUCKET = 'product-images'

export async function uploadVariantImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
  })
  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
