import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import GamePage from './GamePage';
import { useGameState } from '../hooks/useGameState';

// Mock the hook
vi.mock('../hooks/useGameState', () => ({
    useGameState: vi.fn(),
}));

describe('GamePage', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders loading state correctly', () => {
        // Mock the hook to return loading state
        vi.mocked(useGameState).mockReturnValue({
            boardData: null,
            loading: true,
            error: null,
            solution: undefined,
            gridSize: 0,
            revealedColors: new Set(),
            isRevealed: false,
            revealButtonLabel: 'Show Solution',
            showHint: vi.fn(),
            toggleReveal: vi.fn(),
            setRevealedColors: vi.fn(),
        });

        render(<GamePage />);
        expect(screen.getByText('Loading puzzle...')).toBeInTheDocument();
    });

    it('renders error state correctly', () => {
        // Mock the hook to return error state
        vi.mocked(useGameState).mockReturnValue({
            boardData: null,
            loading: false,
            error: 'Failed to load board data',
            solution: undefined,
            gridSize: 0,
            revealedColors: new Set(),
            isRevealed: false,
            revealButtonLabel: 'Show Solution',
            showHint: vi.fn(),
            toggleReveal: vi.fn(),
            setRevealedColors: vi.fn(),
        });

        render(<GamePage />);
        expect(screen.getByText('Failed to load board data')).toBeInTheDocument();
    });

    it('renders game board when data is loaded', () => {
        // Mock the hook to return loaded state
        vi.mocked(useGameState).mockReturnValue({
            boardData: {
                puzzleId: 269,
                gridSize: 8,
                board: [
                    [2, 2, 2, 2, 2, 2, 2, 2],
                    [2, 1, 2, 1, 2, 2, 2, 0],
                    [3, 1, 2, 1, 2, 1, 2, 0],
                    [3, 1, 1, 1, 1, 1, 1, 0],
                    [3, 4, 1, 1, 1, 1, 1, 0],
                    [3, 4, 4, 1, 1, 1, 5, 0],
                    [3, 4, 4, 6, 6, 7, 5, 0],
                    [3, 4, 4, 6, 6, 7, 5, 0],
                ],
                solution: [
                    { row: 7, col: 5 },
                    { row: 5, col: 6 },
                    { row: 6, col: 3 },
                    { row: 2, col: 0 },
                    { row: 1, col: 7 },
                    { row: 4, col: 1 },
                    { row: 0, col: 2 },
                    { row: 3, col: 4 },
                ],
            },
            loading: false,
            error: null,
            solution: [
                [false, false, true, false, false, false, false, false],
                [false, false, false, false, false, false, false, true],
                [true, false, false, false, false, false, false, false],
                [false, false, false, false, true, false, false, false],
                [false, true, false, false, false, false, false, false],
                [false, false, false, false, false, false, true, false],
                [false, false, false, true, false, false, false, false],
                [false, false, false, false, false, true, false, false],
            ],
            gridSize: 8,
            revealedColors: new Set(),
            isRevealed: false,
            revealButtonLabel: 'Show Solution',
            showHint: vi.fn(),
            toggleReveal: vi.fn(),
            setRevealedColors: vi.fn(),
        });

        render(<GamePage />);
        expect(screen.getByText('Puzzle ID: 269')).toBeInTheDocument();
        expect(screen.getByText('Show hint ✨')).toBeInTheDocument();
        expect(screen.getByText('Show Solution')).toBeInTheDocument();
    });
});
