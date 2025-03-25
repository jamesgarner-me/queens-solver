import { useState } from 'react';

export const useInstructionModal = () => {
    // Start with the modal open by default
    const [isModalOpen, setIsModalOpen] = useState(true);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    return {
        isModalOpen,
        closeModal,
        openModal,
    };
};

export default useInstructionModal;
