import pdfToText from 'react-pdftotext'

export default async function FetchLLMResponse(noOfQuestions, pdf, typeOfQuestion) {

  const text = await getPdfText(pdf);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${"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"}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "openai/gpt-3.5-turbo",
        "messages": [
          { "role": "user", "content": `Using the following data, create a series of ${noOfQuestions} ${typeOfQuestion} questions and answers: ${text}`},
          //{ "role": "user", "content": "Give the answers in JSON format. With heading Questions, Answers and Solution"},
        ],
      })
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    console.log(data.choices[0].message.content);
    return data.choices[0].message.content; // Return the content from the response
    
  } catch (error) {
    throw new Error("Error fetching data:", error);
  }
}

//export default fetchLLMResponse;

async function getPdfText(pdf) {
  try {
    const text = await pdfToText(pdf);
    return text;
  } catch (error) {
    console.error("Failed to extract text from pdf");
    throw error;
  }
}


