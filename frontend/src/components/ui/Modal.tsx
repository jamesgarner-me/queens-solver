import React, { useEffect, useRef } from 'react';
import Button from './Button';
import './Modal.css';
import { useModal } from '../../context/ModalContext';

const InstructionModal: React.FC = () => {
    const { isModalOpen, closeModal } = useModal();
    const modalRef = useRef<HTMLDivElement>(null);
    const buttonContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // When modal opens, ensure mouse mode is active and focus without visible outline
        if (isModalOpen && buttonContainerRef.current) {
            // Make sure we're in mouse mode before focusing to prevent outline
            document.body.classList.remove('using-keyboard');
            document.body.classList.add('using-mouse');

            // Focus after a short delay to ensure classes are applied
            setTimeout(() => {
                if (buttonContainerRef.current) {
                    buttonContainerRef.current.focus();
                }
            }, 10);
        }

        // Restore focus when modal closes
        return () => {
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        };
    }, [isModalOpen]);

    // Handle escape key to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isModalOpen) {
                closeModal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen, closeModal]);

    // If modal is not open, don't render anything
    if (!isModalOpen) return null;

    return (
        <div
            className="modal-overlay"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="modal-content" onClick={(e) => e.stopPropagation()} ref={modalRef} role="document">
                <h2 id="modal-title">How to Play Queens Solver</h2>

                <div className="instructions">
                    <ul>
                        <li>
                            <span className="instruction-number" aria-hidden="true">
                                1
                            </span>
                            <p>Click on a coloured region to reveal the location of the queen in that region.</p>
                        </li>
                        <li>
                            <span className="instruction-number" aria-hidden="true">
                                2
                            </span>
                            <p>Use the "Show hint" button to automatically reveal a queen in an unrevealed region.</p>
                        </li>
                        <li>
                            <span className="instruction-number" aria-hidden="true">
                                3
                            </span>
                            <p>Use the "Show Solution" button to see all queens at once, or hide them again.</p>
                        </li>
                    </ul>
                </div>

                <div className="demo-gif">
                    <img
                        src="/queens-solve-howto.gif"
                        alt="Queens Solver gameplay demonstration showing how to reveal queens and use the hint button"
                        width="100%"
                        height="auto"
                    />
                </div>

                <div className="modal-footer">
                    <div ref={buttonContainerRef} tabIndex={0}>
                        <Button onClick={closeModal} variant="primary" ariaLabel="Close instructions">
                            Dismiss
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructionModal;
