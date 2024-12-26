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
	const text = await getPdfText(pdf);

	// Define the prompt based on question type
	let prompt;
	if (typeOfQuestion === "multiple-choice") {
		prompt = `Given the provided data, generate ${noOfQuestions} multiple-choice questions with answers. Make sure each question has 4 options. Return the answer in a array of JSON format objects with the following schema: {"question": "","choices":["",""],"answer": ""} separated by commas. Here's the data: ${text}. Only respond with the JSON text.`;
	} else if (typeOfQuestion === "short-answer") {
		prompt = `Given the provided data, generate ${noOfQuestions} short-answer questions with answers. Return the answer in a array of JSON format objects with the following schema: {"question": "", "answer": ""} separated by commas. Here's the data: ${text}. Only respond with the JSON text.`;
	}

	try {
		const response = await fetch(
			"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=AIzaSyCdUfpsYylxpVuf14Odw5Fh3BAVsZquMdQ",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					contents: [
						{
							parts: [{ text: prompt }],
						},
					],
				}),
			}
		);

		if (!response.ok) {
			throw new Error("Failed to fetch data");
		}
		const data = await response.json();

		// Parse the response content (you might need to adjust this based on Gemini's response format)
		let thisResponse = JSON.parse(data.candidates[0].content.parts[0].text);
		return thisResponse;
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
