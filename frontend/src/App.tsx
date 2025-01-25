import React, { useState } from 'react';
import Gameboard from './components/Gameboard';
import boardData from './boardData';
import queenIcon from './assets/queen.svg';

function App() {
    // Define colors for each number in the board
    const colors = [
        '#b7a4de', // 0
        '#f7cc9a', // 1
        '#9ebdfa', // 2
        '#bcdea6', // 3
        '#dfdfdf', // 4
        '#ee8268', // 5
        '#e8f395', // 6
        '#b8b2a0', // 7
    ];

    const solution = Array(8)
        .fill(null)
        .map(() => Array(8).fill(false));

    const [isRevealed, setIsRevealed] = useState(false);
    const [revealButtonLabel, setRevealButtonLabel] =
        useState('Reveal Solution');

    // const [solution, setSolution] = useState(emptySolution);

    // Iterate through the API response and place queens
    boardData.solution.forEach(({ row, col }) => {
        solution[row][col] = true; // Represent a queen with "Q"
    });

    const toggleReveal = () => {
        setIsRevealed(!isRevealed);
        setRevealButtonLabel(
            revealButtonLabel === 'Reveal Solution'
                ? 'Hide Solution'
                : 'Reveal Solution'
        );
    };

    return (
        <div className="central-container">
            <div className="puzzle-label">PuzzleId: {boardData.puzzleId}</div>
            <Gameboard
                board={boardData.board}
                colors={colors}
                solution={solution}
                queenIcon={queenIcon}
                isRevealed={isRevealed}
            />
            <button className="reveal-button" onClick={toggleReveal}>
                {revealButtonLabel}
            </button>
        </div>
    );
}

export default App;
