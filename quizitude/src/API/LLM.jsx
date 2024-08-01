import { useState } from 'react';
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
        "content": `Given the provided data, generate ${noOfQuestions} multiple-choice questions with answers. Here's the data: ${text}. Only respond with the JSON text as this answer will be fed directly into the model.`
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
  

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${"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"}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        //"model": "gryphe/mythomist-7b:free",
        "model": "meta-llama/llama-3.1-8b-instruct:free",
        //"response_format": {"type": 'json_object'},
        "messages": messages
      })
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();

    console.log(data.choices[0].message.content);
    let thisResponse = JSON.parse(data.choices[0].message.content);


    if (typeOfQuestion === "multiple-choice"){
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


