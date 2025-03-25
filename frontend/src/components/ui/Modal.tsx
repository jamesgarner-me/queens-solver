import React from 'react';
import Button from './Button';
import './Modal.css';
import { useModal } from '../../context/ModalContext';

const InstructionModal: React.FC = () => {
    const { isModalOpen, closeModal } = useModal();

    // If modal is not open, don't render anything
    if (!isModalOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>How to Play Queens Solver</h2>

                <div className="instructions">
                    <ul>
                        <li>
                            <span className="instruction-number">1</span>
                            <p>Click on a coloured region to reveal the location of the queen in that region.</p>
                        </li>
                        <li>
                            <span className="instruction-number">2</span>
                            <p>Use the "Show hint" button to automatically reveal a queen in an unrevealed region.</p>
                        </li>
                        <li>
                            <span className="instruction-number">3</span>
                            <p>Use the "Show Solution" button to see all queens at once, or hide them again.</p>
                        </li>
                    </ul>
                </div>

                <div className="demo-gif">
                    <img
                        src="/queens-solve-howto.gif"
                        alt="Queens Solver gameplay demonstration"
                        width="100%"
                        height="auto"
                    />
                </div>

                <div className="modal-footer">
                    <Button onClick={closeModal} variant="primary">
                        Dismiss
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InstructionModal;
