import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalProvider, useModal } from './ModalContext';

// Test component that uses the modal context
const TestComponent = () => {
    const { isModalOpen, openModal, closeModal } = useModal();

    return (
        <div>
            <div data-testid="modal-state">{isModalOpen ? 'open' : 'closed'}</div>
            <button onClick={openModal}>Open Modal</button>
            <button onClick={closeModal}>Close Modal</button>
        </div>
    );
};

describe('ModalContext', () => {
    it('should provide modal state and functions to components', () => {
        render(
            <ModalProvider>
                <TestComponent />
            </ModalProvider>
        );

        // Initial state should be open (true) as defined in useInstructionModal
        expect(screen.getByTestId('modal-state')).toHaveTextContent('open');

        // Test closeModal functionality
        fireEvent.click(screen.getByText('Close Modal'));
        expect(screen.getByTestId('modal-state')).toHaveTextContent('closed');

        // Test openModal functionality
        fireEvent.click(screen.getByText('Open Modal'));
        expect(screen.getByTestId('modal-state')).toHaveTextContent('open');
    });
});
