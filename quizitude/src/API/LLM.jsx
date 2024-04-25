import { useState } from 'react';
import fetchLLMResponse from './LLM2';


//have a variable to store the result from the API call




export default function LLM() {

  const [apiData, setApiData] = useState('Default no text yet');

  const handleClick = async () => {
    const responseData = await fetchLLMResponse(); // Fetch data
    //console.log(responseData);
    setApiData(responseData);
  }

  return (
    <div>
      <h1>Here is the API data: {apiData}</h1>
      <button onClick={handleClick}>Click me</button>
    </div>
  );

}










//run the function
//fetchLLMResponse();
//export default apiData;
