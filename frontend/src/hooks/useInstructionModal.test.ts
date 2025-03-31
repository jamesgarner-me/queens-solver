import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInstructionModal } from './useInstructionModal';

describe('useInstructionModal', () => {
    it('should initialize with modal open', () => {
        const { result } = renderHook(() => useInstructionModal());
        expect(result.current.isModalOpen).toBe(true);
    });

    it('should close the modal when closeModal is called', () => {
        const { result } = renderHook(() => useInstructionModal());

        act(() => {
            result.current.closeModal();
        });

        expect(result.current.isModalOpen).toBe(false);
    });

    it('should open the modal when openModal is called', () => {
        const { result } = renderHook(() => useInstructionModal());

        // Close modal first
        act(() => {
            result.current.closeModal();
        });
        expect(result.current.isModalOpen).toBe(false);

        // Open modal
        act(() => {
            result.current.openModal();
        });
        expect(result.current.isModalOpen).toBe(true);
    });
});
