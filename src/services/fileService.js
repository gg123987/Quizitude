import { supabase } from "@/utils/supabase";
import { createDeck } from "./deckService";

export const uploadFileAndCreateDeck = async (file, deckData) => {
  try {
    const userId = deckData.user_id;

    // 1. Upload the file to Supabase Storage and create a file record
    const fileRecord = await uploadFile(file, userId);

    const file_id = fileRecord[0].id;

    // Add the file_id to the deckData
    deckData.file_id = file_id;

    // 2. Create a new deck with file_id as a foreign key
    const deck = await createDeck(deckData);

    /* Removed this table for simplicty
    // 3. Link the file to the deck in the deck_files table
    const { error: deckFileError } = await supabase
      .from("deck_files")
      .insert([{ deck_id: deck[0].id, file_id: fileRecord[0].id }]);

    if (deckFileError) throw deckFileError;

    console.log("Deck linked to file");
    */

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

export const getFileByDeck = async (deckId) => {
  // Get the file_id from the deck
  const { data, error } = await supabase
    .from("decks")
    .select("file_id")
    .eq("id", deckId);

  if (error) throw error;

  if (data.length === 0) {
    throw new Error("Deck not found");
  }

  // Get the file details using the file_id
  const fileId = data[0].file_id;
  const { data: fileData, error: fileError } = await supabase
    .from("files")
    .select("*")
    .eq("id", fileId);

  if (fileError) throw fileError;

  return fileData;
}

export const deleteFile = async (fileId) => {
  const { data, error } = await supabase
    .from("files")
    .delete()
    .eq("id", fileId);
  if (error) throw error;
  return data;
};
