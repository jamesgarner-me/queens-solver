import { useState, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import GamePage from './pages/GamePage';
import { ModalProvider } from './context/ModalContext';
import InstructionModal from './components/ui/Modal';
import Footer from './components/ui/Footer';

function App() {
    // Add keyboard navigation detection
    useEffect(() => {
        // Add "using-mouse" class by default
        document.body.classList.add('using-mouse');

        // Add keyboard detection
        function handleFirstTab(e: KeyboardEvent) {
            if (e.key === 'Tab') {
                document.body.classList.remove('using-mouse');
                document.body.classList.add('using-keyboard');

                // Remove this event listener after first keyboard detection
                window.removeEventListener('keydown', handleFirstTab);
            }
        }

        // Add mouse detection
        function handleMouseDown() {
            document.body.classList.remove('using-keyboard');
            document.body.classList.add('using-mouse');

            // Re-add the keyboard detector
            window.addEventListener('keydown', handleFirstTab);
        }

        window.addEventListener('keydown', handleFirstTab);
        window.addEventListener('mousedown', handleMouseDown);

        return () => {
            window.removeEventListener('keydown', handleFirstTab);
            window.removeEventListener('mousedown', handleMouseDown);
        };
    }, []);

    return (
        <ModalProvider>
            <a href="#main-content" className="skip-link">
                Skip to main content
            </a>
            <InstructionModal />
            <MainLayout>
                <div id="main-content" tabIndex={-1}>
                    <GamePage />
                </div>
                <Footer />
            </MainLayout>
        </ModalProvider>
    );
}

export default App;
