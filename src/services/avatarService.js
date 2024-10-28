import { supabase } from "@/utils/supabase";

// Downloads an image from Supabase Storage
export async function downloadAvatarImage(path) {
  try {
    const { data, error } = await supabase.storage.from("files").download(path);
    if (error) throw error;
    return URL.createObjectURL(data);
  } catch (error) {
    console.error("Error downloading image: ", error.message);
    throw error;
  }
}

// Uploads a new avatar image to Supabase Storage
export async function uploadAvatarImage(userId, file) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${userId}/avatars/${fileName}`;

  try {
    const { error } = await supabase.storage
      .from("files")
      .upload(filePath, file);
    if (error) throw error;
    return filePath;
  } catch (error) {
    console.error("Error uploading image: ", error.message);
    throw error;
  }
}
