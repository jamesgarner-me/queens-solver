import React from 'react';
import './Gameboard.css';

// Define prop types
interface GameboardProps {
    board: number[][];
    colors: string[];
    solution: boolean[][];
    queenIcon: string;
    isRevealed: boolean;
}

const Gameboard: React.FC<GameboardProps> = ({
    board,
    colors,
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
            right:
                col === board[row].length - 1 ||
                board[row][col + 1] !== current,
        };

        // Return classes for the borders
        return Object.entries(borders)
            .filter(([_, value]) => value)
            .map(([side]) => `border-${side}`)
            .join(' ');
    };

    return (
        <div className="gameboard">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`cell ${getCellClass(
                                rowIndex,
                                colIndex
                            )}`}
                            style={{
                                backgroundColor: colors[cell] || 'transparent',
                            }}
                        >
                            {solution[rowIndex][colIndex] && isRevealed && (
                                <img
                                    src={queenIcon}
                                    alt="Queen"
                                    className="queen-icon"
                                />
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Gameboard;
