import React from 'react';
import Gameboard from '../components/game/Gameboard';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import ErrorMessage from '../components/ui/ErrorMessage';
import { useGameState } from '../hooks/useGameState';
import { useModal } from '../context/ModalContext';
import { BOARD_COLOURS } from '../constants/colours';
import queenIcon from '../assets/queen.svg';
import './GamePage.css';

const GamePage: React.FC = () => {
    const {
        boardData,
        loading,
        error,
        solution,
        revealedColours,
        setRevealedColours,
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
                    colours={BOARD_COLOURS}
                    revealedColours={revealedColours}
                    setRevealedColours={setRevealedColours}
                    solution={solution}
                    queenIcon={queenIcon}
                    isRevealed={isRevealed}
                />
            )}

            <div className="button-container">
                <Button
                    onClick={showHint}
                    disabled={!boardData || revealedColours.size >= (boardData?.solution.length ?? 0)}
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
