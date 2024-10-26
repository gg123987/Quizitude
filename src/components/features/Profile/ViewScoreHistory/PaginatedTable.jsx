import React, { useState } from 'react';
import './viewScoreHistory.css'; // Import CSS for styling

const PaginatedTable = ({ data }) => {
    const [currentPage, setCurrentPage] = useState(1); 
    const rowsPerPage = 5; // Number of rows per page, with the styling, fits the space in table

    // Calculate total pages
    const totalPages = Math.ceil(data.length / rowsPerPage);

    // Get the rows to display for the current page
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);


    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate score func
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
                        <th>Date Reviewed</th>
                        <th>Time</th>
                        <th>Known</th>
                        <th>Didn't Know</th>
                        <th>Overall Score</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((row, index) => (
                        <tr key={index}>
                            <td>{row.flashcard}</td>
                            <td>{row.date}</td>
                            <td>{row.time}</td>
                            <td>{row.knew}</td>
                            <td>{row.unknown}</td>
                            <td>{calculatePercentageScore(row.knew, row.unknown)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination"> 
                {/* basically generates a button for each page, doesn't fit the figma spec for now*/}
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PaginatedTable;