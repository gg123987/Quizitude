import {
  uploadFileAndCreateDeck,
  checkForDuplicateFile,
  uploadFile,
  getFilesByUser,
  getFileByDeck,
  getFileById,
  deleteFile,
} from "@/services/fileService";
import { createDeck } from "@/services/deckService";
import { vi, describe, it, expect, beforeEach } from "vitest";

describe("File Service", () => {
  let mockFile;
  const deckData = { user_id: "test-user-id", name: "Test Deck" };

  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();

    // Setup a mock file object
    mockFile = new File(["content"], "test.pdf", {
      type: "application/pdf",
      size: 12345,
    });

    // Mock the return values for checkForDuplicateFile
    vi.mocked(checkForDuplicateFile).mockResolvedValue([
      mockFile,
      deckData.user_id,
    ]);

    // Mock other dependent functions
    vi.mocked(uploadFile).mockResolvedValue({ id: "file-id" });
    vi.mocked(createDeck).mockResolvedValue({
      id: "deck-id",
      name: "Test Deck",
    });
  });

  it("should upload a file and create a deck", async () => {
    // Ensure the mock returns the expected value
    const duplicateCheckResult = await checkForDuplicateFile(
      mockFile,
      deckData.user_id
    );
    expect(duplicateCheckResult).toEqual([mockFile, deckData.user_id]);

    const result = await uploadFileAndCreateDeck(mockFile, deckData);

    // Ensure the function was called correctly
    expect(vi.mocked(checkForDuplicateFile).mock.calls[0]).toEqual([
      mockFile,
      deckData.user_id,
    ]);

    // Check the result
    expect(result).toEqual({
      deck: { id: "deck-id", name: "Test Deck" },
      file: { id: "file-id" },
    });
  });

  it("should check for duplicate files", async () => {
    const mockFile = new File(["content"], "test.pdf", {
      type: "application/pdf",
    });
    const userId = "test-user-id";
    const existingFiles = [
      { id: "existing-file-id", name: "test.pdf", size: 12345 },
    ];

    vi.mocked(checkForDuplicateFile).mockResolvedValue(existingFiles);

    const result = await checkForDuplicateFile(mockFile, userId);

    expect(result).toEqual(existingFiles);
    expect(vi.mocked(checkForDuplicateFile).mock.calls[0]).toEqual([
      mockFile,
      userId,
    ]);
  });

  it("should upload a file", async () => {
    const mockFile = new File(["content"], "test.pdf", {
      type: "application/pdf",
    });
    const userId = "test-user-id";
    const fileRecord = [{ id: "file-id" }];

    vi.mocked(uploadFile).mockResolvedValue(fileRecord);

    const result = await uploadFile(mockFile, userId);

    expect(result).toEqual(fileRecord);
    expect(vi.mocked(uploadFile).mock.calls[0]).toEqual([mockFile, userId]);
  });

  it("should retrieve all files for a user", async () => {
    const userId = "test-user-id";
    const filesData = [
      {
        id: "file-id-1",
        name: "file1.pdf",
        user_id: userId,
        decks: [],
        deck_count: 0,
      }, // Added deck_count
      {
        id: "file-id-2",
        name: "file2.pdf",
        user_id: userId,
        decks: [{ id: "deck-id-1" }],
        deck_count: 1,
      },
    ];

    vi.mocked(getFilesByUser).mockResolvedValue(filesData);

    const result = await getFilesByUser(userId);

    expect(result).toEqual(filesData); // Removed transformation since data now includes deck_count
    expect(vi.mocked(getFilesByUser).mock.calls[0]).toEqual([userId]);
  });

  it("should retrieve a file by deck", async () => {
    const deckId = "deck-id-1";
    const fileId = "file-id-1";

    vi.mocked(getFileByDeck).mockResolvedValue({ file_id: fileId });

    const result = await getFileByDeck(deckId);

    expect(result).toEqual({ file_id: fileId });
    expect(vi.mocked(getFileByDeck).mock.calls[0]).toEqual([deckId]);
  });

  it("should retrieve a file by its ID", async () => {
    const fileId = "file-id-1";
    const fileData = {
      id: fileId,
      name: "test.pdf",
      path: "test-path",
      type: "application/pdf",
    };

    vi.mocked(getFileById).mockResolvedValue(fileData);

    const result = await getFileById(fileId);

    expect(result).toEqual(fileData);
    expect(vi.mocked(getFileById).mock.calls[0]).toEqual([fileId]);
  });

  it("should delete a file", async () => {
    const fileId = "file-id-1";

    vi.mocked(deleteFile).mockResolvedValue({ id: fileId });

    const result = await deleteFile(fileId);

    expect(result).toEqual({ id: fileId });
    expect(vi.mocked(deleteFile).mock.calls[0]).toEqual([fileId]);
  });
});
