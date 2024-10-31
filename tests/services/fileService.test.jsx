import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  uploadFileAndCreateDeck,
  checkForDuplicateFile,
  uploadFile,
  getFilesByUser,
  getFileByDeck,
  getFileById,
  deleteFile,
} from "@/services/fileService";
import { supabase } from "@/utils/supabase";

// Mock the Supabase client
vi.mock("@/utils/supabase", () => ({
  supabase: {
    from: vi.fn(),
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn(),
        download: vi.fn(),
        remove: vi.fn(),
      }),
    },
  },
}));

describe("File Service", () => {
  const mockFile = new File(["content"], "test.txt", {
    type: "text/plain",
    size: 1234,
  });
  const mockDeckData = { user_id: "user1", name: "Test Deck" };
  const mockUserId = "user1";
  const mockFileId = "1";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("uploadFileAndCreateDeck", () => {
    it("should upload a file and create a deck successfully", async () => {
      const mockFileRecord = [{ id: mockFileId }];
      const mockDeck = [{ id: "deck1", ...mockDeckData, file_id: mockFileId }];

      // Mock checking for duplicate file
      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(), // Chainable
        single: vi.fn().mockResolvedValueOnce({ data: null, error: null }),
      });

      // Mock file upload - ensure it returns structured data
      supabase.storage.from.mockReturnValueOnce({
        upload: vi.fn().mockResolvedValueOnce({
          data: {}, // Mock the data structure you expect
          error: null, // Simulate no error
        }),
      });

      // Mock file record creation
      supabase.from.mockReturnValueOnce({
        insert: vi.fn().mockReturnThis(),
        select: vi
          .fn()
          .mockResolvedValueOnce({ data: mockFileRecord, error: null }),
      });

      // Mock deck creation
      supabase.from.mockReturnValueOnce({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValueOnce({ data: mockDeck, error: null }),
      });

      const result = await uploadFileAndCreateDeck(mockFile, mockDeckData);
      expect(result).toEqual({ deck: mockDeck[0], file: mockFileRecord[0] });
      expect(supabase.from).toHaveBeenCalledWith("files");
    });

    it("should throw an error when file upload fails", async () => {
      const error = new Error("Upload Error");

      // Mock checking for duplicate file
      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            eq: vi.fn().mockReturnValueOnce({
              single: vi
                .fn()
                .mockResolvedValueOnce({ data: null, error: null }),
            }),
          }),
        }),
      });

      // Mock file upload to fail
      supabase.storage.from.mockReturnValueOnce({
        upload: vi.fn().mockResolvedValueOnce({ error }),
      });

      await expect(
        uploadFileAndCreateDeck(mockFile, mockDeckData)
      ).rejects.toThrow(error);
    });
  });

  describe("checkForDuplicateFile", () => {
    it("should return existing files when a duplicate is found", async () => {
      const existingFiles = [{ id: mockFileId, name: "test.txt", size: 1234 }];

      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            eq: vi
              .fn()
              .mockResolvedValueOnce({ data: existingFiles, error: null }),
          }),
        }),
      });

      const result = await checkForDuplicateFile(mockFile, mockUserId);
      expect(result).toEqual(existingFiles);
    });

    it("should return null when no duplicates are found", async () => {
      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            eq: vi.fn().mockResolvedValueOnce({ data: null, error: null }),
          }),
        }),
      });

      const result = await checkForDuplicateFile(mockFile, mockUserId);
      expect(result).toBeNull();
    });
  });

  describe("uploadFile", () => {
    it("should upload a file and create a file record", async () => {
      const fileRecord = [{ id: mockFileId }];

      supabase.storage.from.mockReturnValueOnce({
        upload: vi.fn().mockResolvedValueOnce({ data: {}, error: null }),
      });

      supabase.from.mockReturnValueOnce({
        insert: vi.fn().mockReturnValueOnce({
          select: vi
            .fn()
            .mockResolvedValueOnce({ data: fileRecord, error: null }),
        }),
      });

      const result = await uploadFile(mockFile, mockUserId);
      expect(result).toEqual(fileRecord);
    });

    it("should throw an error if file upload fails", async () => {
      const error = new Error("Upload Error");

      supabase.storage.from.mockReturnValueOnce({
        upload: vi.fn().mockResolvedValueOnce({ error }),
      });

      await expect(uploadFile(mockFile, mockUserId)).rejects.toThrow(error);
    });
  });

  describe("getFilesByUser", () => {
    it("should return files with deck count", async () => {
      const filesData = [
        { id: mockFileId, name: "test.txt", decks: [{ id: "deck1" }] },
      ];

      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockResolvedValueOnce({ data: filesData, error: null }),
        }),
      });

      const result = await getFilesByUser(mockUserId);
      expect(result).toEqual([{ ...filesData[0], deck_count: 1 }]);
    });

    it("should throw an error if fetching files fails", async () => {
      const error = new Error("Fetch Error");

      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockResolvedValueOnce({ error }),
        }),
      });

      await expect(getFilesByUser(mockUserId)).rejects.toThrow(error);
    });
  });

  describe("getFileByDeck", () => {
    it("should return the file associated with a specific deck", async () => {
      const fileId = "file_id";
      const deckData = [{ file_id: fileId }];

      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockResolvedValueOnce({ data: deckData, error: null }),
        }),
      });

      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi
            .fn()
            .mockResolvedValueOnce({ data: [{ id: fileId }], error: null }),
        }),
      });

      const result = await getFileByDeck("deck1");
      expect(result).toEqual([{ id: fileId }]);
    });

    it("should throw an error if fetching the deck fails", async () => {
      const error = new Error("Deck Not Found");

      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockResolvedValueOnce({ error }),
        }),
      });

      await expect(getFileByDeck("deck1")).rejects.toThrow(error);
    });
  });

  describe("deleteFile", () => {
    it("should delete a file successfully", async () => {
      const fileData = { path: "user1/test.txt" };

      // Mock fetching the file to delete
      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            single: vi
              .fn()
              .mockResolvedValueOnce({ data: fileData, error: null }), // Here we return the resolved value
          }),
        }),
      });

      // Mock the deletion from storage
      supabase.storage.from.mockReturnValueOnce({
        remove: vi.fn().mockResolvedValueOnce({ data: {}, error: null }),
      });

      // Mock the delete chain for the "files" table
      supabase.from.mockReturnValueOnce({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValueOnce({ data: fileData, error: null }), // Resolve as if deletion was successful
      });

      const result = await deleteFile(mockFileId);
      expect(result).toEqual(fileData);
    });

    it("should throw an error if file deletion fails", async () => {
      const error = new Error("Delete Error");

      // Mock fetching the file to delete
      supabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({ data: {}, error: error }),
          }),
        }),
      });

      // Mock the deletion from storage
      supabase.storage.from.mockReturnValueOnce({
        remove: vi.fn().mockResolvedValueOnce({ error }),
      });

      // Mock the delete chain for the "files" table
      supabase.from.mockReturnValueOnce({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValueOnce({ error }),
      });

      const result = deleteFile(mockFileId);
      await expect(result).rejects.toThrow(error);
    });
  });
});
