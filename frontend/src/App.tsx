import React from 'react';
import MainLayout from './layouts/MainLayout';
import GamePage from './pages/GamePage';
import { ModalProvider } from './context/ModalContext';
import InstructionModal from './components/ui/Modal';

function App() {
    return (
        <ModalProvider>
            <InstructionModal />
            <MainLayout>
                <GamePage />
            </MainLayout>
        </ModalProvider>
    );
}

export default App;
