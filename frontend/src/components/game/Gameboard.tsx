import React from 'react';
import './Gameboard.css';
import { BoardType, SolutionType } from '../../types/gameTypes';

interface GameboardProps {
    board: BoardType;
    colours: string[];
    revealedColours: Set<number>;
    setRevealedColours: React.Dispatch<React.SetStateAction<Set<number>>>;
    solution: boolean[][];
    queenIcon: string;
    isRevealed: boolean;
}

const Gameboard: React.FC<GameboardProps> = ({
    board,
    colours,
    revealedColours,
    setRevealedColours,
    solution,
    queenIcon,
    isRevealed,
}) => {
    const getCellClass = (row: number, col: number): string => {
        const current = board[row][col];
        const borders = {
            top: row === 0 || board[row - 1][col] !== current,
            bottom: row === board.length - 1 || board[row + 1][col] !== current,
            left: col === 0 || board[row][col - 1] !== current,
            right: col === board[row].length - 1 || board[row][col + 1] !== current,
        };

        // Return classes for the borders
        return Object.entries(borders)
            .filter(([_, value]) => value)
            .map(([side]) => `border-${side}`)
            .join(' ');
    };

    const handleCellClick = (row: number, col: number) => {
        const colourIndex = board[row][col];

        // If this colour hasn't been revealed yet
        if (!revealedColours.has(colourIndex)) {
            // Find the queen position for this colour region
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    if (board[i][j] === colourIndex && solution[i][j]) {
                        // Add this colour to revealed colours
                        setRevealedColours(new Set([...revealedColours, colourIndex]));
                        return;
                    }
                }
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCellClick(row, col);
        }
    };

    return (
        <div className="gameboard" role="grid" aria-label="Queens Puzzle Board">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="row" role="row">
                    {row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`cell ${getCellClass(rowIndex, colIndex)}`}
                            style={{
                                backgroundColor: colours[cell] || 'transparent',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                            onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                            role="gridcell"
                            tabIndex={0}
                            aria-label={`Cell at row ${rowIndex + 1}, column ${colIndex + 1}${
                                solution[rowIndex][colIndex] && (isRevealed || revealedColours.has(cell))
                                    ? ', contains a queen'
                                    : ''
                            }`}
                        >
                            {solution[rowIndex][colIndex] && (isRevealed || revealedColours.has(cell)) && (
                                <img src={queenIcon} alt="" className="queen-icon" aria-hidden="true" />
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Gameboard;
