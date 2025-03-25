import React, { createContext, useContext, ReactNode } from 'react';
import useInstructionModal from '../hooks/useInstructionModal';

interface ModalContextType {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

// Create the context with default values
const ModalContext = createContext<ModalContextType>({
    isModalOpen: false,
    openModal: () => {},
    closeModal: () => {},
});

// Create a provider component
export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const modalState = useInstructionModal();

    return <ModalContext.Provider value={modalState}>{children}</ModalContext.Provider>;
};

// Create a custom hook to use the modal context
export const useModal = () => useContext(ModalContext);

export default ModalContext;
