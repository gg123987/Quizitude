// LLM.test.jsx
import { describe, it, expect, vi } from "vitest";
import FetchLLMResponse from "@/api/LLM"; // Adjust the import path as necessary
import pdfToText from "react-pdftotext";

// Mocking pdfToText at the top level
vi.mock("react-pdftotext", () => ({
  default: vi.fn(), // Create a mock function without default resolved value
}));

// Mock pdfjs-dist to prevent actual imports during tests
vi.mock("pdfjs-dist/build/pdf.mjs", () => ({
  getDocument: vi.fn().mockReturnValue({
    promise: Promise.resolve({
      getPage: vi.fn().mockResolvedValue({
        getTextContent: vi.fn().mockResolvedValue({ items: [] }),
      }),
    }),
  }),
}));

describe("FetchLLMResponse", () => {
  const mockPdf = new File(["dummy content"], "dummy.pdf", {
    type: "application/pdf",
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch multiple-choice questions", async () => {
    pdfToText.mockResolvedValue("Sample PDF text"); // Mock the return value for pdfToText
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify([
                    {
                      question: "What is 2 + 2?",
                      choices: ["3", "4", "5", "6"],
                      answer: "4",
                    },
                  ]),
                },
              },
            ],
          }),
      })
    );

    const result = await FetchLLMResponse(1, mockPdf, "multiple-choice");

    // Validate the returned result
    expect(result).toEqual([
      {
        question: "What is 2 + 2?",
        choices: ["3", "4", "5", "6"],
        answer: "4",
      },
    ]);
  });

  it("should fetch short-answer questions", async () => {
    pdfToText.mockResolvedValue("Sample PDF text"); // Mock the return value for pdfToText
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify([
                    {
                      question: "What is the capital of France?",
                      answer: "Paris",
                    },
                  ]),
                },
              },
            ],
          }),
      })
    );

    const result = await FetchLLMResponse(1, mockPdf, "short-answer");

    // Validate the returned result
    expect(result).toEqual([
      {
        question: "What is the capital of France?",
        answer: "Paris",
      },
    ]);
  });

  it("should handle fetch errors", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    // Expect the function to reject with the error message
    await expect(
      FetchLLMResponse(1, mockPdf, "multiple-choice")
    ).rejects.toThrow("Failed to fetch data");
  });

  it("should handle pdf extraction errors", async () => {
    pdfToText.mockRejectedValue(new Error("PDF extraction failed"));

    // Expect the function to reject with the specific error
    await expect(
      FetchLLMResponse(1, mockPdf, "multiple-choice")
    ).rejects.toThrow("PDF extraction failed");
  });
});
