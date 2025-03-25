import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Gameboard from './Gameboard';

describe('Gameboard', () => {
    const mockProps = {
        board: [
            [0, 0, 1],
            [1, 1, 0],
            [2, 2, 2],
        ],
        colours: ['#BBA2E2', '#FFC992', '#96BEFF'],
        revealedColours: new Set<number>(),
        setRevealedColours: vi.fn(),
        solution: [
            [true, false, false],
            [false, false, true],
            [false, true, false],
        ],
        queenIcon: 'test-queen-icon.svg',
        isRevealed: false,
    };

    it('renders the board with correct number of cells', () => {
        render(<Gameboard {...mockProps} />);
        const cells = document.getElementsByClassName('cell');
        expect(cells.length).toBe(9); // 3x3 board
    });

    it('shows queen when clicking a cell in correct region', () => {
        render(<Gameboard {...mockProps} />);
        const cells = document.getElementsByClassName('cell');

        // Click first cell (which has a queen in the solution)
        fireEvent.click(cells[0]);

        expect(mockProps.setRevealedColours).toHaveBeenCalledWith(new Set([0]));
    });

    it('shows all queens when isRevealed is true', () => {
        const revealedProps = {
            ...mockProps,
            isRevealed: true,
        };

        render(<Gameboard {...revealedProps} />);
        const queens = screen.getAllByAltText('Queen');
        expect(queens).toHaveLength(3); // There are 3 queens in the solution
    });

    it('shows queens for revealed colours', () => {
        const revealedColourProps = {
            ...mockProps,
            revealedColours: new Set([0]), // Reveal colour 0
            solution: [
                [true, false, false], // Only one queen in colour region 0
                [false, false, false],
                [false, false, false],
            ],
        };

        render(<Gameboard {...revealedColourProps} />);
        const queens = screen.getAllByAltText('Queen');
        expect(queens).toHaveLength(1); // Should show only one queen in colour region 0
    });
});
