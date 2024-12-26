import Groq from "groq-sdk";
import pdfToText from "react-pdftotext";

/**
 * FetchLLMResponse - Fetches responses from a Language Learning Model (LLM) based on the provided PDF and question type.
 *
 * @param {number} noOfQuestions - Number of questions to generate.
 * @param {File} pdf - PDF file from which text is extracted.
 * @param {string} typeOfQuestion - Type of questions to generate ("multiple-choice" or "short-answer").
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of questions and answers.
 */
export default async function FetchLLMResponse(
	noOfQuestions,
	pdf,
	typeOfQuestion
) {
	// Extract text from the provided PDF
	const text = await getPdfText(pdf);

	// Define the message structure based on the type of question
	let messages;
	if (typeOfQuestion === "multiple-choice") {
		messages = [
			{
				role: "system",
				content: `Give the answer in a array of JSON format objects with the following schema: {"question": "","choices":["",""],"answer": ""} separated by commas`,
			},
			{
				role: "user",
				content: `Given the provided data, generate ${noOfQuestions} multiple-choice questions with answers. Make sure each question has 4 options. Here's the data: ${text}. Only respond with the JSON text as this answer will be fed directly into the model.`,
			},
		];
	} else if (typeOfQuestion === "short-answer") {
		messages = [
			{
				role: "system",
				content: `Give the answer in a array of JSON format objects with the following schema: {"question": "", "answer": ""} separated by commas`,
			},
			{
				role: "user",
				content: `Given the provided data, generate ${noOfQuestions} short-answer questions with answers. Here's the data: ${text}. Only respond with the JSON text as this answer will be fed directly into the model.`,
			},
		];
	}

	// Use the OpenRouter API to fetch the response from the LLM model
	try {
		const response = await fetch(
			"https://openrouter.ai/api/v1/chat/completions",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${"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"}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					model: "meta-llama/llama-3.1-8b-instruct",
					messages: messages,
				}),
			}
		);

		if (!response.ok) {
			throw new Error("Failed to fetch data");
		}
		const data = await response.json();

		// Parse the response content
		let thisResponse = JSON.parse(data.choices[0].message.content);
		return thisResponse; // Return the content from the response
	} catch (error) {
		alert(
			"Error: Issue with the AI model. Please attempt to regenerate the flashcards"
		);
		throw new Error("Error fetching data: " + error.message);
	}
}

/**
 * getPdfText - Extracts text from a given PDF file.
 *
 * @param {File} pdf - PDF file from which text is to be extracted.
 * @returns {Promise<string>} - Returns a promise that resolves to the extracted text.
 */
async function getPdfText(pdf) {
	try {
		const pdfjsLib = await import("pdfjs-dist/build/pdf.mjs");
		const text = await pdfToText(pdf);
		return text;
	} catch (error) {
		console.error("Failed to extract text from pdf");
		throw error;
	}
}
