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

    const totalQueens = boardData?.solution.length ?? 0;
    const revealedQueens = revealedColours.size;
    const remainingQueens = totalQueens - revealedQueens;

    return (
        <main className="game-container">
            <header className="header-row">
                <div className="puzzle-label" aria-live="polite">
                    {boardData ? (
                        <>
                            Puzzle ID:{' '}
                            <a
                                href="https://www.linkedin.com/games/queens"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Visit LinkedIn Queens puzzle ${boardData.puzzleId}`}
                            >
                                {boardData.puzzleId}
                            </a>
                        </>
                    ) : (
                        'No puzzle data'
                    )}
                </div>
                <button className="instruction-button" onClick={openModal} aria-label="Open how to use instructions">
                    How to use
                </button>
            </header>

            {boardData && solution && (
                <>
                    <Gameboard
                        board={boardData.board}
                        colours={BOARD_COLOURS}
                        revealedColours={revealedColours}
                        setRevealedColours={setRevealedColours}
                        solution={solution}
                        queenIcon={queenIcon}
                        isRevealed={isRevealed}
                    />

                    <div aria-live="polite" className="visually-hidden">
                        {isRevealed
                            ? 'All queens revealed.'
                            : `${revealedQueens} out of ${totalQueens} queens revealed. ${remainingQueens} remaining.`}
                    </div>
                </>
            )}

            <div className="button-container">
                <Button
                    onClick={showHint}
                    disabled={!boardData || revealedColours.size >= (boardData?.solution.length ?? 0)}
                    variant="primary"
                    ariaLabel="Show a hint by revealing one queen"
                >
                    Show hint ✨
                </Button>

                <Button
                    onClick={toggleReveal}
                    disabled={!boardData}
                    variant="secondary"
                    ariaLabel={isRevealed ? 'Hide all queens' : 'Show all queens'}
                >
                    {revealButtonLabel}
                </Button>
            </div>
        </main>
    );
};

export default GamePage;
