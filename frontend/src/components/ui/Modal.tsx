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
                            <p>Click on a colored region to find a queen. Each color contains exactly one queen.</p>
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

                <div className="demo-container">
                    <p className="demo-text">Watch how the game works:</p>
                    <div className="demo-placeholder">
                        <p>Placeholder for gameplay demonstration GIF/MP4</p>
                        <div className="placeholder-dimensions">(400px × 300px recommended)</div>
                    </div>
                </div>

                <div className="modal-footer">
                    <Button onClick={closeModal} variant="primary">
                        OK
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InstructionModal;
