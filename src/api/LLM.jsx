import pdfToText from 'react-pdftotext'

export default async function FetchLLMResponse(noOfQuestions, pdf, typeOfQuestion) {

  const text = await getPdfText(pdf);

  //This code is to control the message that is sent to the LLM model based on the type of question
  let messages;
  if (typeOfQuestion === "multiple-choice") {
    messages = [
      { "role": "system", 
        "content": `Give the answer in a array of JSON format objects with the following schema: {"question": "","choices":["",""],"answer": ""} separated by commas`
      },
      { 
        "role": "user", 
        "content": `Given the provided data, generate ${noOfQuestions} multiple-choice questions with answers. Make sure each question has 4 options. Here's the data: ${text}. Only respond with the JSON text as this answer will be fed directly into the model.`
      }
    ];
  } else if (typeOfQuestion === "short-answer") {
    messages = [
      { 
        "role": "system", 
        "content": `Give the answer in a array of JSON format objects with the following schema: {"question": "", "answer": ""} separated by commas`
      },
      { 
        "role": "user", 
        "content": `Given the provided data, generate ${noOfQuestions} short-answer questions with answers. . Here's the data: ${text}. Only respond with the JSON text as this answer will be fed directly into the model.`
      }      
    ]
  }
  
  // THIS USES THE OPENROUTER API`
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${"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"}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "anthropic/claude-3-haiku",
        "messages": messages
      })
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();

    let thisResponse = JSON.parse(data.choices[0].message.content);

    return thisResponse; // Return the content from the response
    
  } catch (error) {
    console.error("Error fetching data1:", error);
    alert("Error: Issue with the AI model. Please attempt to regenerate the flashcards");
    throw Error("Error fetching data2:", error);
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


