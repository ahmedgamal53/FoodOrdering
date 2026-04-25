import { supabase } from "@/lib/supabase";

export const getImageUrl = (path: string) => {
  if (!path) return null;
  const { data } = supabase.storage.from("product-image").getPublicUrl(path);
  return data.publicUrl;
};
