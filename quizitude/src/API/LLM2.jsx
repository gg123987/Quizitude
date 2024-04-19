



/*
const fetchLLMResponse = async() => {
    fetch("https://openrouter.ai/api/v1/chat/completions", {
     method: "POST",
     headers: {
       "Authorization": `Bearer ${"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"}`,
       "Content-Type": "application/json"
     },
     body: JSON.stringify({
       "model": "openai/gpt-3.5-turbo",
       "messages": [
         {"role": "user", "content": "Tell me a joke about passover"},
       ],
     })
   })
       .then((res) => res.json())
       .then((data) => {
           console.log("testing")
           const data = await 
           //store the result in the variable in json format from the choices section
           //setApiData(JSON.stringify(data.choices[0].message.content));
           return JSON.stringify(data.choices[0].message.content);
       });
   }
*/
const fetchLLMResponse = async () => {
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
          { "role": "user", "content": "Tell me a joke about passover" },
        ],
      })
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    
    const data = await response.json();
    return data.choices[0].message.content; // Return the content from the response
  } catch (error) {
    throw new Error("Error fetching data:", error);
  }
};

export default fetchLLMResponse;


