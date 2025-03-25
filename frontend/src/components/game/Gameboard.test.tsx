import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Gameboard from './Gameboard';

describe('Gameboard', () => {
    const mockProps = {
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
        colours: [
            '#BBA2E2', // 0
            '#FFC992', // 1
            '#96BEFF', // 2
            '#B3DFA0', // 3
            '#DFDFDF', // 4
            '#FF7B5F', // 5
            '#E6F388', // 6
            '#B9B29E', // 7
        ],
        revealedColours: new Set<number>(),
        setRevealedColours: vi.fn(),
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
        queenIcon: 'test-queen-icon.svg',
        isRevealed: false,
    };

    it('renders the board with correct number of cells', () => {
        render(<Gameboard {...mockProps} />);
        const cells = document.getElementsByClassName('cell');
        expect(cells.length).toBe(64); // 8x8 board
    });

    it('shows queen when clicking a cell in correct region', () => {
        render(<Gameboard {...mockProps} />);
        const cells = document.getElementsByClassName('cell');

        // Click a cell in region 2 which has a queen (row 0, col 2)
        fireEvent.click(cells[2]); // First row, third cell

        expect(mockProps.setRevealedColours).toHaveBeenCalledWith(new Set([2]));
    });

    it('shows all queens when isRevealed is true', () => {
        const revealedProps = {
            ...mockProps,
            isRevealed: true,
        };

        render(<Gameboard {...revealedProps} />);
        const queens = screen.getAllByAltText('Queen');
        expect(queens).toHaveLength(8); // There are 8 queens in the solution
    });
});
