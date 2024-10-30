import { describe, it, expect, vi } from "vitest";
import {
  downloadAvatarImage,
  uploadAvatarImage,
} from "@/services/avatarService";
import { supabase } from "@/utils/supabase";

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn().mockReturnValue("mocked-url");

vi.mock("@/utils/supabase", () => ({
  supabase: {
    storage: {
      from: vi.fn().mockReturnThis(),
      download: vi.fn(),
      upload: vi.fn(),
    },
  },
}));

describe("avatarService", () => {
  describe("downloadAvatarImage", () => {
    it("should download an image and return its URL", async () => {
      const mockData = new Blob(["image data"], { type: "image/png" });
      supabase.storage.download.mockResolvedValue({
        data: mockData,
        error: null,
      });

      const path = "path/to/image.png";
      const result = await downloadAvatarImage(path);

      expect(supabase.storage.from).toHaveBeenCalledWith("files");
      expect(supabase.storage.download).toHaveBeenCalledWith(path);
      expect(result).toBe("mocked-url");
    });

    it("should throw an error if download fails", async () => {
      const mockError = new Error("Download failed");
      supabase.storage.download.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const path = "path/to/image.png";

      await expect(downloadAvatarImage(path)).rejects.toThrow(
        "Download failed"
      );
    });
  });

  describe("uploadAvatarImage", () => {
    it("should upload an image and return its file path", async () => {
      const mockFile = new File(["image data"], "image.png", {
        type: "image/png",
      });
      supabase.storage.upload.mockResolvedValue({ error: null });

      const userId = "user123";
      const result = await uploadAvatarImage(userId, mockFile);

      expect(supabase.storage.from).toHaveBeenCalledWith("files");
      expect(supabase.storage.upload).toHaveBeenCalled();
      expect(result).toMatch(new RegExp(`${userId}/avatars/`));
    });

    it("should throw an error if upload fails", async () => {
      const mockFile = new File(["image data"], "image.png", {
        type: "image/png",
      });
      const mockError = new Error("Upload failed");
      supabase.storage.upload.mockResolvedValue({ error: mockError });

      const userId = "user123";

      await expect(uploadAvatarImage(userId, mockFile)).rejects.toThrow(
        "Upload failed"
      );
    });
  });
});
