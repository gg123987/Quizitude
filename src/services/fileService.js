import { supabase } from "@/utils/supabase";
import { createDeck } from "./deckService";

/**
 * Uploads a file and creates a deck associated with that file.
 * @param {File} file - The file to be uploaded.
 * @param {Object} deckData - The data for the deck to be created.
 * @returns {Object} - The created deck and file information.
 */
export const uploadFileAndCreateDeck = async (file, deckData) => {
  try {
    const userId = deckData.user_id;

    // 1. Check if the file already exists
    const existingFile = await checkForDuplicateFile(file, userId);
    if (existingFile) {
      console.log("File already exists:", existingFile);
      return {
        message: "This file has already been uploaded.",
        file: existingFile,
      };
    }

    // 2. Upload the file to Supabase Storage and create a file record
    const fileRecord = await uploadFile(file, userId);
    console.log(fileRecord);
    const file_id = fileRecord[0].id;

    // Add the file_id to the deckData
    deckData.file_id = file_id;

    // 3. Create a new deck with file_id as a foreign key
    const deck = await createDeck(deckData);

    /* Removed this table for simplicity
    // 4. Link the file to the deck in the deck_files table
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

/**
 * Checks if a file with the same name and size already exists for a user.
 * @param {File} file - The file to check for duplicates.
 * @param {string} userId - The ID of the user.
 * @returns {Object|null} - The existing file if found, otherwise null.
 */
export const checkForDuplicateFile = async (file, userId) => {
  const { data: existingFiles, error } = await supabase
    .from("files")
    .select("*")
    .eq("user_id", userId)
    .eq("name", file.name)
    .eq("size", file.size);

  if (error) {
    console.error("Error checking for duplicate file:", error);
    return null;
  }

  return existingFiles; // Will be null if no duplicate is found
};

/**
 * Uploads a file to Supabase Storage and creates a record in the files table.
 * @param {File} file - The file to be uploaded.
 * @param {string} userId - The ID of the user.
 * @returns {Object} - The created file record.
 */
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

/**
 * Retrieves all files uploaded by a specific user.
 * @param {string} userId - The ID of the user.
 * @returns {Array} - The list of files with deck count.
 */
export const getFilesByUser = async (userId) => {
  const { data, error } = await supabase
    .from("files")
    .select("*, decks!decks_file_id_fkey(id)")
    .eq("user_id", userId);

  if (error) throw error;

  const filesWithDeckCount = data.map((file) => ({
    ...file,
    deck_count: file.decks.length,
  }));

  console.log("Files for user:", filesWithDeckCount);

  return filesWithDeckCount;
};

/**
 * Retrieves the file associated with a specific deck.
 * @param {string} deckId - The ID of the deck.
 * @returns {Object} - The file information.
 */
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
};

/**
 * Retrieves a file by its ID.
 * @param {string} fileId - The ID of the file.
 * @returns {File} - The file object.
 */
export const getFileById = async (fileId) => {
  // Step 1: Get the file path from the files table
  const { data: fileData, error } = await supabase
    .from("files")
    .select("*")
    .eq("id", fileId)
    .single();

  if (error) throw error;

  // Check if fileData is found
  if (!fileData) {
    throw new Error(`File with id ${fileId} not found.`);
  }

  // Step 2: Download the file from Supabase storage
  const { data: fileBlob, error: downloadError } = await supabase.storage
    .from("files")
    .download(fileData.path);

  if (downloadError) throw downloadError;

  // Step 3: Create a File object
  const file = new File([fileBlob], fileData.name, {
    type: fileData.type || "application/pdf",
    lastModified: new Date().getTime(),
  });

  return file;
};

/**
 * Deletes a file by its ID.
 * @param {string} fileId - The ID of the file to be deleted.
 * @returns {Object} - The deleted file record.
 */
export const deleteFile = async (fileId) => {
  try {
    // Get the file path from the files table
    const { data: fileData, error: fileError } = await supabase
      .from("files")
      .select("path")
      .eq("id", fileId)
      .single();

    if (fileError) throw fileError;

    const filePath = fileData.path;

    // Delete the file from Supabase Storage
    const { error: storageError } = await supabase.storage
      .from("files")
      .remove([filePath]);

    if (storageError) throw storageError;

    // Delete the file record from the files table
    const { data, error } = await supabase
      .from("files")
      .delete()
      .eq("id", fileId);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error in deleteFile:", error);
    throw error;
  }
};
