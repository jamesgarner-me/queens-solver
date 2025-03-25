import React from 'react';
import MainLayout from './layouts/MainLayout';
import GamePage from './pages/GamePage';
import { ModalProvider } from './context/ModalContext';
import InstructionModal from './components/ui/Modal';
import Footer from './components/ui/Footer';

function App() {
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
