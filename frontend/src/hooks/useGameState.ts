import { useState, useEffect } from 'react';
import { BoardData, SolutionType } from '../types/gameTypes';
import { fetchLatestBoard } from '../services/apiService';

interface GameState {
    boardData: BoardData | null;
    loading: boolean;
    error: string | null;
    solution: SolutionType | undefined;
    gridSize: number;
    revealedColours: Set<number>;
    isRevealed: boolean;
    revealButtonLabel: string;
    showHint: () => void;
    toggleReveal: () => void;
    setRevealedColours: React.Dispatch<React.SetStateAction<Set<number>>>;
}

export const useGameState = (): GameState => {
    // State declarations
    const [boardData, setBoardData] = useState<BoardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [gridSize, setGridSize] = useState<number>(0);
    const [solution, setSolution] = useState<SolutionType>();
    const [revealedColours, setRevealedColours] = useState<Set<number>>(new Set());
    const [isRevealed, setIsRevealed] = useState(false);
    const [revealButtonLabel, setRevealButtonLabel] = useState('Show Solution');

    // Fetch board data on component mount
    useEffect(() => {
        const loadBoardData = async () => {
            try {
                setLoading(true);
                const data = await fetchLatestBoard();
                setBoardData(data);
                setError(null);
            } catch (e) {
                setError('Failed to load board data. Please try again later.');
                console.error('Failed to fetch board data: ', e);
            } finally {
                setLoading(false);
            }
        };

        loadBoardData();
    }, []);

    // Generate solution grid when board data changes
    useEffect(() => {
        if (boardData?.gridSize) {
            setGridSize(boardData.gridSize);
        }

        if (boardData?.solution && gridSize > 0) {
            const solutionGrid = Array(gridSize)
                .fill(null)
                .map(() => Array(gridSize).fill(false));

            boardData.solution.forEach(({ row, col }) => {
                solutionGrid[row][col] = true;
            });

            setSolution(solutionGrid);
        }
    }, [boardData, gridSize]);

    // Auto-reveal all queens when all hints have been shown
    useEffect(() => {
        if (boardData && revealedColours.size >= boardData.solution.length) {
            setIsRevealed(true);
            setRevealButtonLabel('Hide Solution');
        }
    }, [revealedColours, boardData]);

    // Show a hint by revealing one queen
    const showHint = () => {
        if (!boardData || !solution) return;

        // Find the next colour region that doesn't have a queen revealed
        const colourRegions = new Map<number, { row: number; col: number }>();

        // Map each colour to its queen position
        boardData.board.forEach((row, rowIndex) => {
            row.forEach((colourIndex, colIndex) => {
                if (solution[rowIndex][colIndex]) {
                    colourRegions.set(colourIndex, { row: rowIndex, col: colIndex });
                }
            });
        });

        // Find first unrevealed colour region
        for (const [colourIndex, _] of colourRegions) {
            if (!revealedColours.has(colourIndex)) {
                const newRevealedColours = new Set([...revealedColours, colourIndex]);
                setRevealedColours(newRevealedColours);
                return;
            }
        }
    };

    // Toggle showing/hiding all queens
    const toggleReveal = () => {
        const newIsRevealed = !isRevealed;
        setIsRevealed(newIsRevealed);
        setRevealButtonLabel(newIsRevealed ? 'Hide Solution' : 'Show Solution');

        // If revealing solution, mark all colours as revealed
        if (newIsRevealed && boardData && boardData.solution) {
            // Collect all colour indexes that have queens
            const coloursWithQueens = new Set<number>();
            if (solution) {
                boardData.board.forEach((row, rowIndex) => {
                    row.forEach((colourIndex, colIndex) => {
                        if (solution[rowIndex][colIndex]) {
                            coloursWithQueens.add(colourIndex);
                        }
                    });
                });
            }
            setRevealedColours(coloursWithQueens);
        }
        // Reset revealed colours when hiding
        else if (!newIsRevealed) {
            setRevealedColours(new Set());
        }
    };

    return {
        boardData,
        loading,
        error,
        solution,
        gridSize,
        revealedColours,
        isRevealed,
        revealButtonLabel,
        showHint,
        toggleReveal,
        setRevealedColours,
    };
};
