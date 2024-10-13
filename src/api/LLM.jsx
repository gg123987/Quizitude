import Groq from "groq-sdk";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

import pdfToText from "react-pdftotext";

export default async function FetchLLMResponse(
  noOfQuestions,
  pdf,
  typeOfQuestion
) {
  const text = await getPdfText(pdf);

  //const groq = new Groq({ apiKey: "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" ,dangerouslyAllowBrowser: true});
  //const groq = new Groq({ apiKey: "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" ,dangerouslyAllowBrowser: true});

  //This code is to control the message that is sent to the LLM model based on the type of question
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
        content: `Given the provided data, generate ${noOfQuestions} short-answer questions with answers. . Here's the data: ${text}. Only respond with the JSON text as this answer will be fed directly into the model.`,
      },
    ];
  }

  // THIS USES THE OPENROUTER API`
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
          model: "anthropic/claude-3-haiku",
          messages: messages,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();

    //console.log(data.choices[0].message.content);
    let thisResponse = JSON.parse(data.choices[0].message.content);

    // if (typeOfQuestion === "multiple-choice"){
    //   // Modify each question in the response array
    //   thisResponse.forEach(question => {
    //     // Append a new line to the value of the "question" key
    //     question.question += '\n';
    //     question.question += 'Options:\n';

    //     // Initialize a counter for options
    //     let optionCounter = 65; // ASCII value of 'A'
    //     // Loop through choices
    //     question.choices.forEach(choice => {
    //       // Append the letter for the option
    //       question.question += `${String.fromCharCode(optionCounter)}. ${choice}\n`;
    //       // Increment the counter for the next letter
    //       optionCounter++;
    //     });

    //     // Delete the "choices" key
    //     delete question.choices;
    //   });
    // }

    //console.log(thisResponse);
    return thisResponse; // Return the content from the response
  } catch (error) {
    console.error("Error fetching data1:", error);
    alert(
      "Error: Issue with the AI model. Please attempt to regenerate the flashcards"
    );
    throw Error("Error fetching data2:", error);
  }

  /*
  // THIS USES THE LATEST LLAMA MODEL3 AVAILABLE ON GROQ API FOR FREE 
  try {
    const response = await groq.chat.completions.create({
      messages: messages,
      model: "llama3-8b-8192"  // Update this with the desired model 
    });

    if (!response.choices.length) {
      throw new Error("No choices returned from the model");
    }

    let thisResponse = JSON.parse(response.choices[0].message.content);
    if (typeOfQuestion === "multiple-choice") {
      // Modify each question in the response array
      thisResponse.forEach(question => {
        // Append a new line to the value of the "question" key
        question.question += '\n';
        question.question += 'Options:\n';

        // Initialize a counter for options
        let optionCounter = 65; // ASCII value of 'A'
        // Loop through choices
        question.choices.forEach(choice => {
          // Append the letter for the option
          question.question += `${String.fromCharCode(optionCounter)}. ${choice}\n`;
          // Increment the counter for the next letter
          optionCounter++;
        });
        
        // Delete the "choices" key
        delete question.choices;
      });
    }

    console.log(thisResponse);
    return thisResponse; // Return the content from the response
    
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Error: Issue with the AI model. Please attempt to regenerate the flashcards");
    throw new Error("Error fetching data:", error);
  }
  */
}

//export default fetchLLMResponse;

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
