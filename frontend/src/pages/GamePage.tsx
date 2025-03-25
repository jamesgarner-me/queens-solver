import React from 'react';
import Gameboard from '../components/game/Gameboard';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import ErrorMessage from '../components/ui/ErrorMessage';
import { useGameState } from '../hooks/useGameState';
import { useModal } from '../context/ModalContext';
import { BOARD_COLORS } from '../constants/colors';
import queenIcon from '../assets/queen.svg';
import './GamePage.css';

const GamePage: React.FC = () => {
    const {
        boardData,
        loading,
        error,
        solution,
        revealedColors,
        setRevealedColors,
        isRevealed,
        revealButtonLabel,
        showHint,
        toggleReveal,
    } = useGameState();

    const { openModal } = useModal();

    if (loading) {
        return <Loading message="Loading puzzle..." />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    return (
        <div className="game-container">
            <div className="header-row">
                <div className="puzzle-label">{boardData ? `Puzzle ID: ${boardData.puzzleId}` : 'No puzzle data'}</div>
                <button className="instruction-button" onClick={openModal}>
                    How to Play
                </button>
            </div>

            {boardData && solution && (
                <Gameboard
                    board={boardData.board}
                    colours={BOARD_COLORS}
                    revealedColors={revealedColors}
                    setRevealedColors={setRevealedColors}
                    solution={solution}
                    queenIcon={queenIcon}
                    isRevealed={isRevealed}
                />
            )}

            <div className="button-container">
                <Button
                    onClick={showHint}
                    disabled={!boardData || revealedColors.size >= (boardData?.solution.length ?? 0)}
                    variant="primary"
                >
                    Show hint ✨
                </Button>

                <Button onClick={toggleReveal} disabled={!boardData} variant="secondary">
                    {revealButtonLabel}
                </Button>
            </div>
        </div>
    );
};

export default GamePage;
