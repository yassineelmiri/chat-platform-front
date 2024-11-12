import { create } from 'zustand';

interface CallModalStore {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;

}

export const useCallModalStore = create<CallModalStore>((set) => ({
    isModalOpen: false,
    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),

}));