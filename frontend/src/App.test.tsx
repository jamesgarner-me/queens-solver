import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { useGameState } from './hooks/useGameState';

// Mock the useGameState hook
vi.mock('./hooks/useGameState', () => ({
    useGameState: vi.fn(),
}));

// Mock fetch response data
const mockFetchResponse = {
    puzzleId: 123,
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
};

describe('App', () => {
    // Create test states
    let mockShowHint = vi.fn();
    let mockToggleReveal = vi.fn();
    let mockSetRevealedColours = vi.fn();
    let mockRevealedColours = new Set<number>();

    beforeEach(() => {
        // Reset mocks before each test
        vi.resetAllMocks();
        mockShowHint = vi.fn();
        mockToggleReveal = vi.fn();
        mockSetRevealedColours = vi.fn();
        mockRevealedColours = new Set<number>();

        // Default mock implementation for the useGameState hook
        vi.mocked(useGameState).mockReturnValue({
            boardData: mockFetchResponse,
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
            revealedColours: mockRevealedColours,
            isRevealed: false,
            revealButtonLabel: 'Show Solution',
            showHint: mockShowHint,
            toggleReveal: mockToggleReveal,
            setRevealedColours: mockSetRevealedColours,
        });
    });

    it('renders puzzle ID after loading', async () => {
        render(<App />);

        const puzzleId = await screen.findByText('Puzzle ID:');
        expect(puzzleId).toBeInTheDocument();
    });

    it('renders skip link for accessibility', () => {
        render(<App />);
        const skipLink = screen.getByText('Skip to main content');
        expect(skipLink).toBeInTheDocument();
        expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('toggles solution visibility when reveal button is clicked', async () => {
        const user = userEvent.setup();

        // For first render
        vi.mocked(useGameState).mockReturnValue({
            boardData: mockFetchResponse,
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
            revealedColours: mockRevealedColours,
            isRevealed: false,
            revealButtonLabel: 'Show Solution',
            showHint: mockShowHint,
            toggleReveal: mockToggleReveal,
            setRevealedColours: mockSetRevealedColours,
        });

        render(<App />);

        // Find the button using ARIA label
        const revealButton = await screen.findByRole('button', {
            name: /show all queens/i,
        });

        // Click to reveal
        await user.click(revealButton);

        // Verify the toggleReveal function was called
        expect(mockToggleReveal).toHaveBeenCalledTimes(1);

        // Update mock for the state change after revealing
        vi.mocked(useGameState).mockReturnValue({
            boardData: mockFetchResponse,
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
            revealedColours: new Set([2, 0, 3, 1, 5, 6, 7, 4]), // All colours revealed
            isRevealed: true,
            revealButtonLabel: 'Hide Solution',
            showHint: mockShowHint,
            toggleReveal: mockToggleReveal,
            setRevealedColours: mockSetRevealedColours,
        });

        // Rerender to simulate state update
        render(<App />);

        // Verify button text changed
        const hideButton = await screen.findByRole('button', {
            name: /hide all queens/i,
        });
        expect(hideButton).toHaveTextContent('Hide Solution');
    });

    it('calls showHint when hint button is clicked', async () => {
        const user = userEvent.setup();

        render(<App />);

        // Find the button using ARIA label
        const hintButton = await screen.findByRole('button', {
            name: /show a hint/i,
        });

        // Click hint button
        await user.click(hintButton);

        // Verify showHint was called
        expect(mockShowHint).toHaveBeenCalledTimes(1);
    });

    it('disables hint button when all queens are revealed', async () => {
        const user = userEvent.setup();

        // Mock all colours being revealed
        vi.mocked(useGameState).mockReturnValue({
            boardData: mockFetchResponse,
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
            revealedColours: new Set([2, 0, 3, 1, 5, 6, 7, 4]), // All colours revealed
            isRevealed: true,
            revealButtonLabel: 'Hide Solution',
            showHint: mockShowHint,
            toggleReveal: mockToggleReveal,
            setRevealedColours: mockSetRevealedColours,
        });

        render(<App />);

        // Find the hint button
        const hintButton = await screen.findByRole('button', {
            name: /show a hint/i,
        });

        // Verify it's disabled
        expect(hintButton).toBeDisabled();
    });
});
