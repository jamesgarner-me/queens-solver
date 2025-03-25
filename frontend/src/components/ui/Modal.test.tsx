import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

        // Modal should be visible
        const modalTitle = screen.getByText('How to Play Queens Solver');
        expect(modalTitle).toBeInTheDocument();

        // Check for instruction points
        expect(screen.getByText(/Click on a coloured region/i)).toBeInTheDocument();
        expect(screen.getByText(/Use the "Show hint" button/i)).toBeInTheDocument();
        expect(screen.getByText(/Use the "Show Solution" button/i)).toBeInTheDocument();

        // Check for GIF
        expect(screen.getByAltText('Queens Solver gameplay demonstration')).toBeInTheDocument();

        // Check for Dismiss button
        expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
    });

    it('should call closeModal when Dismiss button is clicked', () => {
        const mockCloseModal = vi.fn();

        // Mock the useModal hook to return isModalOpen as true and mockCloseModal
        vi.mocked(useModal).mockReturnValue({
            isModalOpen: true,
            openModal: vi.fn(),
            closeModal: mockCloseModal,
        });

        render(<InstructionModal />);

        // Click the Dismiss button
        const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
        fireEvent.click(dismissButton);

        // Verify closeModal was called
        expect(mockCloseModal).toHaveBeenCalledTimes(1);
    });
});
