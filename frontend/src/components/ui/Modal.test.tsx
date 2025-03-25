import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InstructionModal from './Modal';
import { useModal } from '../../context/ModalContext';

// Mock the useModal hook
vi.mock('../../context/ModalContext', () => ({
    useModal: vi.fn(),
}));

describe('InstructionModal', () => {
    it('should not render when isModalOpen is false', () => {
        // Mock the useModal hook to return isModalOpen as false
        vi.mocked(useModal).mockReturnValue({
            isModalOpen: false,
            openModal: vi.fn(),
            closeModal: vi.fn(),
        });

        render(<InstructionModal />);

        // Modal should not be visible
        const modalElement = screen.queryByText('How to Play Queens Solver');
        expect(modalElement).not.toBeInTheDocument();
    });

    it('should render when isModalOpen is true', () => {
        // Mock the useModal hook to return isModalOpen as true
        vi.mocked(useModal).mockReturnValue({
            isModalOpen: true,
            openModal: vi.fn(),
            closeModal: vi.fn(),
        });

        render(<InstructionModal />);

        // Modal should be visible with correct ARIA attributes
        const modalTitle = screen.getByText('How to Play Queens Solver');
        expect(modalTitle).toBeInTheDocument();

        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');

        // Check for instruction points
        expect(screen.getByText(/Click on a coloured region/i)).toBeInTheDocument();
        expect(screen.getByText(/Use the "Show hint" button/i)).toBeInTheDocument();
        expect(screen.getByText(/Use the "Show Solution" button/i)).toBeInTheDocument();

        // Check for GIF
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('alt', expect.stringContaining('Queens Solver gameplay demonstration'));

        // Check for Dismiss button
        const dismissButton = screen.getByRole('button', { name: /close instructions/i });
        expect(dismissButton).toBeInTheDocument();
    });

    it('should call closeModal when Dismiss button is clicked', async () => {
        const mockCloseModal = vi.fn();
        const user = userEvent.setup();

        // Mock the useModal hook to return isModalOpen as true and mockCloseModal
        vi.mocked(useModal).mockReturnValue({
            isModalOpen: true,
            openModal: vi.fn(),
            closeModal: mockCloseModal,
        });

        render(<InstructionModal />);

        // Click the Dismiss button
        const dismissButton = screen.getByRole('button', { name: /close instructions/i });
        await user.click(dismissButton);

        // Verify closeModal was called
        expect(mockCloseModal).toHaveBeenCalledTimes(1);
    });

    it('should call closeModal when clicking the overlay', async () => {
        const mockCloseModal = vi.fn();
        const user = userEvent.setup();

        // Mock the useModal hook
        vi.mocked(useModal).mockReturnValue({
            isModalOpen: true,
            openModal: vi.fn(),
            closeModal: mockCloseModal,
        });

        render(<InstructionModal />);

        // Get the overlay
        const overlay = screen.getByRole('dialog');

        // Click the overlay but not the content
        await user.click(overlay);

        // Verify closeModal was called
        expect(mockCloseModal).toHaveBeenCalledTimes(1);
    });
});
