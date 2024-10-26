import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@/components/features/Profile/Avatar/Avatar'; // Ensure this path is correct
import './viewScoreHistory.css';
import PaginatedTable from './PaginatedTable';

const testData = [
  // example data just for display
  // assuming validation for input means that the names will fit the table 
    { flashcard: 'Engineering', date: '2024-09-01', time: '14:00', knew: 10, unknown: 5 },
    { flashcard: 'AAAAAAAAAAAAAAAAAAAA', date: '2024-09-07', time: '20:00', knew: 2, unknown: 18 },
    { flashcard: 'Com Sci', date: '2024-09-02', time: '15:00', knew: 8, unknown: 2 },
    { flashcard: 'Bio', date: '2024-09-03', time: '16:00', knew: 12, unknown: 8 },
    { flashcard: 'WW2-Hist', date: '2024-09-04', time: '17:00', knew: 19, unknown: 1 },
    { flashcard: 'Organic Chem', date: '2024-09-05', time: '18:00', knew: 20, unknown: 0 },
    { flashcard: 'Capital Cities', date: '2024-09-06', time: '19:00', knew: 10, unknown: 10 },
    { flashcard: 'test deck', date: '2024-09-07', time: '20:00', knew: 2, unknown: 18 },
    
];

function chosenSortMethod(text, data) {
  // able to add more sorting options, drop down menu select-wrapper
  switch (text) {
    case "name":
      return dataListSortByName(data);
    case "date":
      return dataListSortByDate(data);
    case "name desc":
      return dataListSortByNameDesc(data);
    case "date desc":
      return dataListSortByDateDesc(data);
    default:
      console.log("Should never get here")
  }
}

// sorting functions
function dataListSortByName(data) {
  return  data.slice().sort((a, b) => a.flashcard.localeCompare(b.flashcard));
};

function dataListSortByDate(data) {
  return data.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
};

function dataListSortByNameDesc(data) {
  return  data.slice().sort((a, b) => b.flashcard.localeCompare(a.flashcard));
};

function dataListSortByDateDesc(data) {
  return data.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
};

const ScoreTable = () => {
  
    const calculatePercentageScore = (knew, unknown) => {
      if (knew + unknown === 0) return 'N/A';
      return ((knew / (knew + unknown)) * 100).toFixed(2) + '%';
    };
  
    return (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Flashcard</th>
              <th>Date</th>
              <th>Time</th>
              <th>Knew</th>
              <th>Didn't Know</th>
              <th>Overall Score</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.flashcard}</td>
                <td>{item.date}</td>
                <td>{item.time}</td>
                <td>{item.knew}</td>
                <td>{item.unknown}</td>
                <td>{calculatePercentageScore(item.knew, item.unknown)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

const ViewScoreHistory = () => {

  const [selectedOption, setSelectedOption] = useState("name");

  const handleSelectChange = (event) => {
    // for change in dropdown menu
    setSelectedOption(event.target.value);
  };

  const sortedData = chosenSortMethod(selectedOption, testData);

  console.log("hey at least this is working") // debug test

  return (
      <div className="score-page">
           <div className="score-container">
              <h4 style ={{textAlign: "left", paddingBottom:"5px"}}>View Score History</h4>
               <div className ="select-wrapper">
                <select value={selectedOption} onChange={handleSelectChange}>
                  <option value="name">Name Asc</option> 
                  <option value="name desc">Name Desc</option>
                  <option value="date">Date Asc</option>
                  <option value="date desc">Date Desc</option>
                  <option value="default">Default</option>
                </select>
              </div>
              <PaginatedTable data={sortedData} />
          </div>
      </div>
  );
};


export default ViewScoreHistory;