import { useState, useEffect } from 'react';
import Gameboard from './components/Gameboard';
// import boardData from './boardData';
import queenIcon from './assets/queen.svg';

interface Solution {
    row: number;
    col: number;
}

interface BoardData {
    gridSize: number;
    puzzleId: number;
    board: number[][];
    solution: Solution[];
}

function App() {
    // Define colours for each number in the board
    // Todo define more colours to reflect larger board
    // Todo move this somewhere else
    const colours = [
        '#BBA2E2', // 0
        '#FFC992', // 1
        '#96BEFF', // 2
        '#B3DFA0', // 3
        '#DFDFDF', // 4
        '#FF7B5F', // 5
        '#E6F388', // 6
        '#B9B29E', // 7
        '#DFA0BF', // 8
        '#A3D2D8', // 9
    ];

    const [boardData, setBoardData] = useState<BoardData | null>(null);
    const [gridSize, setGridSize] = useState<number>(0);
    const [solution, setSolution] = useState<boolean[][]>();
    const [hints, setHints] = useState<boolean[][]>();
    const [numberOfHintsToShow, setNumberOfHintsToShow] = useState<number>(0);
    const [isRevealed, setIsRevealed] = useState(false);
    const [revealButtonLabel, setRevealButtonLabel] =
        useState('Reveal Solution');

    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                // todo implement loading overlay/modal
                const response = await fetch(
                    'http://localhost:8000/boards/latest'
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
        if (boardData?.gridSize) {
            setGridSize(boardData.gridSize);
        }
        if (boardData?.solution && gridSize > 0) {
            const emptyArray = returnEmptyArray(gridSize);

            setHints(emptyArray);

            const solution = emptyArray.map((row) => [...row]);

            boardData.solution.forEach(({ row, col }) => {
                solution[row][col] = true;
            });
            setSolution(solution);
        }
    }, [boardData, gridSize]);

    const returnEmptyArray = (size: number): boolean[][] => {
        return Array(size)
            .fill(null)
            .map(() => Array(size).fill(false));
    };
    const isMaxHintsShown = (): boolean => {
        return numberOfHintsToShow >= gridSize;
    };

    const toggleReveal = () => {
        setIsRevealed(!isRevealed);
        setRevealButtonLabel(
            revealButtonLabel === 'Reveal Solution'
                ? 'Hide Solution'
                : 'Reveal Solution'
        );
        // reset hints shown
        setHints(returnEmptyArray(gridSize));
        setNumberOfHintsToShow(0);
    };

    const showHint = () => {
        if (!isMaxHintsShown()) {
            const numHints = numberOfHintsToShow + 1;
            setNumberOfHintsToShow(numHints);

            let i = 0;
            solution?.some((row, rowIndex) => {
                return row.some((cell, colIndex) => {
                    if (cell) {
                        hints![rowIndex][colIndex] = true;
                        i++;
                        if (i === numHints) {
                            return true; // break
                        }
                    }
                    return false;
                });
            });
        }
    };

    return (
        <div className="central-container">
            <div className="puzzle-label">
                {boardData ? `PuzzleId: ${boardData.puzzleId}` : 'Loading...'}
            </div>
            {boardData && solution && (
                <Gameboard
                    board={boardData.board}
                    colours={colours}
                    hints={hints}
                    solution={solution}
                    queenIcon={queenIcon}
                    isRevealed={isRevealed}
                />
            )}
            <button
                className="button"
                onClick={showHint}
                disabled={!boardData || isMaxHintsShown()}
            >
                {boardData ? 'Show hint ✨' : 'Loading...'}
            </button>
            <button
                className="button"
                onClick={toggleReveal}
                disabled={!boardData}
            >
                {boardData ? revealButtonLabel : 'Loading...'}
            </button>
        </div>
    );
}

export default App;
