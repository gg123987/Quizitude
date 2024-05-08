import { useState } from 'react';
import pdfToText from 'react-pdftotext'




export default async function FetchLLMResponse(noOfQuestions, pdf, typeOfQuestion) {

  
  const text = await getPdfText(pdf);


  //USE THIS CODE TO CHANGE THE MESSAGE DEPENDING ON THE TYPE OF QUESTION
  // let messages;
  // if (typeOfQuestion === "multiple-choice") {
  //   messages = [
  //     { 
  //       "role": "user", 
  //       "content": `Using the following data, create a series of ${noOfQuestions} multiple-choice questions and answers: Give the answers in raw JSON format enclosed only in square brackets with Keys named 'question' and 'answer'. If the question is Multiple choice, include all options in the question key. HERE IS THE DATA:  ${text}. `
  //     }
  //   ];
  // } else if (typeOfQuestion === "short-answer") {
  //   messages = [
  //     { 
  //       "role": "user", 
  //       "content": `Using the following data, create a series of ${noOfQuestions} short-answer questions and answers: Give the answers in raw JSON format enclosed only in square brackets with Keys named 'question' and 'answer'. HERE IS THE DATA:  ${text}. `
  //     }
  //   ]
  // }
  

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${"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"}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemma-7b-it:free",
        "messages": [
          { "role": "user", "content": `Given the provided data, generate ${noOfQuestions} ${typeOfQuestion} questions with answers. Give the answer in JSON format with keys "question", "choices" in an array, and "answer". The JSON format should be enclosed only in square brackets. Here's the data: ${text}.`},
        ],
      })
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    console.log(data.choices[0].message.content);
    console.log(data.choices[0].message);
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


