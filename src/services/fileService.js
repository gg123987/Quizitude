import { supabase } from "@/utils/supabase";
import { createDeck } from "./deckService";

export const uploadFileAndCreateDeck = async (file, deckData) => {
  try {
    const userId = deckData.user_id;

    // 1. Upload the file to Supabase Storage and create a file record
    const fileRecord = await uploadFile(file, userId);

    // 2. Create a new deck
    const deck = await createDeck(deckData);

    // 3. Link the file to the deck in the deck_files table
    const { error: deckFileError } = await supabase
      .from("deck_files")
      .insert([{ deck_id: deck[0].id, file_id: fileRecord[0].id }]);

    if (deckFileError) throw deckFileError;

    console.log("Deck linked to file");

    return { deck: deck[0], file: fileRecord[0] };
  } catch (error) {
    console.error("Error in uploadFileAndCreateDeck:", error);
    throw error;
  }
};

export const uploadFile = async (file, userId) => {
  try {
    // 1. Create a user-specific folder path
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`; // Use userId as the top-level folder

    // 2. Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("files")
      .upload(filePath, file);

    if (error) throw error;

    console.log("File upload response:", data);

    // 3. Insert the file info into the files table
    const { data: fileData, error: fileError } = await supabase
      .from("files")
      .insert([
        { name: file.name, path: filePath, size: file.size, user_id: userId },
      ])
      .select("*");

    if (fileError) throw fileError;
    console.log("File record created:", fileData);

    return fileData;
  } catch (error) {
    console.error("Error in uploadFile:", error);
    throw error;
  }
};

export const getFilesByDeck = async (deckId) => {
  const { data, error } = await supabase
    .from("files")
    .select("files.*")
    .join("deck_files", "files.id", "deck_files.file_id")
    .eq("deck_files.deck_id", deckId);
  if (error) throw error;
  return data;
};

export const deleteFile = async (fileId) => {
  const { data, error } = await supabase
    .from("files")
    .delete()
    .eq("id", fileId);
  if (error) throw error;
  return data;
};
