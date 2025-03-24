import React from 'react';
import './Gameboard.css';

// Define prop types
interface GameboardProps {
    board: number[][];
    colours: string[];
    revealedColors: Set<number>;
    setRevealedColors: React.Dispatch<React.SetStateAction<Set<number>>>;
    solution: boolean[][];
    queenIcon: string;
    isRevealed: boolean;
}

const Gameboard: React.FC<GameboardProps> = ({
    board,
    colours,
    revealedColors,
    setRevealedColors,
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
        const colorIndex = board[row][col];

        // If this color hasn't been revealed yet
        if (!revealedColors.has(colorIndex)) {
            // Find the queen position for this color region
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    if (board[i][j] === colorIndex && solution[i][j]) {
                        // Add this color to revealed colors
                        setRevealedColors(new Set([...revealedColors, colorIndex]));
                        return;
                    }
                }
            }
        }
    };

    return (
        <div className="gameboard">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`cell ${getCellClass(rowIndex, colIndex)}`}
                            style={{
                                backgroundColor: colours[cell] || 'transparent',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                        >
                            {solution[rowIndex][colIndex] && (isRevealed || revealedColors.has(cell)) && (
                                <img src={queenIcon} alt="Queen" className="queen-icon" />
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Gameboard;
