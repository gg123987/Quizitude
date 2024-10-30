// LLM.test.jsx
import { describe, it, expect, vi } from "vitest";
import FetchLLMResponse from "@/api/LLM";
import pdfToText from "react-pdftotext";

describe("FetchLLMResponse", () => {
  const mockPdf = new File(["dummy content"], "dummy.pdf", {
    type: "application/pdf",
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch multiple-choice questions", async () => {
    // Mock the pdfToText function to return sample text
    pdfToText.mockResolvedValue("Sample PDF text");

    // Mock the fetch call to return a predefined structure
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify([
                    // Ensure this matches the expected output
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
    // Mock pdfToText function again for short-answer test
    pdfToText.mockResolvedValue("Sample PDF text");

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify([
                    // Ensure this is correct as well
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
});
