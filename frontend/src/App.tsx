import { useState, useEffect } from 'react';
import Gameboard from './components/Gameboard';
// import boardData from './boardData';
import queenIcon from './assets/queen.svg';

interface Solution {
    row: number;
    col: number;
}

interface BoardData {
    puzzleId: number;
    board: number[][];
    solution: Solution[];
}

function App() {
    // Define colors for each number in the board
    // Todo define more colours to reflect larger board
    // Todo move this somewhere else
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

    const [boardData, setBoardData] = useState<BoardData | null>(null);
    const [solution, setSolution] = useState<boolean[][]>();
    const [isRevealed, setIsRevealed] = useState(false);
    const [revealButtonLabel, setRevealButtonLabel] =
        useState('Reveal Solution');

    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                // todo implement loading overlay/modal
                const response = await fetch(
                    'https://run.mocky.io/v3/f971c020-03c0-463d-8ae3-52d9e1d9d3b5'
                );
                const data = await response.json();
                setBoardData(data);
            } catch (e) {
                // todo display error toast
                console.error('Failed to fetch board data: ', e);
            }
        };
        fetchBoardData();
    }, []);

    useEffect(() => {
        if (boardData?.solution) {
            // todo make size dynamic based on puzzle size
            const solution = Array(8)
                .fill(null)
                .map(() => Array(8).fill(false));

            boardData.solution.forEach(({ row, col }) => {
                solution[row][col] = true;
            });

            setSolution(solution);
        }
    }, [boardData]);

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
            <div className="puzzle-label">
                {boardData ? `PuzzleId: ${boardData.puzzleId}` : 'Loading...'}
            </div>
            {boardData && solution && (
                <Gameboard
                    board={boardData.board}
                    colors={colors}
                    solution={solution}
                    queenIcon={queenIcon}
                    isRevealed={isRevealed}
                />
            )}
            <button
                className="reveal-button"
                onClick={toggleReveal}
                disabled={!boardData}
            >
                {boardData ? revealButtonLabel : 'Loading...'}
            </button>
        </div>
    );
}

export default App;
