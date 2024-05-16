import React, { useState, useEffect } from 'react';
import './flashcard.css';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

const FlashcardSM = ({ flashcard, isCurrentCard=false, width = "220px", isReviewed=false }) => {
    const [height, setHeight] = useState('auto'); 
    const [aspectRatio, setAspectRatio] = useState(2 / 3.5);

    // Calculate height based on aspect ratio when the width changes
    useEffect(() => {
        if (mode === "studying") {
            setAspectRatio(2 / 3.5);
        } else {
            setAspectRatio(2 / 3.5)
        }
        setHeight(`${parseFloat(width) * aspectRatio}px`);
    }, [width]);

    const status = flashcard.score !== undefined || isCurrentCard ? 'review' : 'hidden';
    const outline = isCurrentCard ? "blue" : flashcard.score === undefined ? "white" : flashcard.score ? "green" : "red";

    return (
        <div style={{ width, height, borderColor: outline }}>
            <div className="front">
                {status !== 'hidden' && flashcard.question}
                {status === 'hidden' && 
                    <div className="flashcard-placeholder">
                        <QuestionMarkIcon color="action" />
                    </div>
                }
            </div>
        </div>
    );
};

export default FlashcardSM;