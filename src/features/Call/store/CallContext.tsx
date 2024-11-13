
import { create } from 'zustand';

interface CallStore {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    activeCallId: string | null;
    setActiveCallId: (id: string | null) => void;
}

export const useCallStore = create<CallStore>((set) => ({
    isModalOpen: false,
    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),
    activeCallId: null,
    setActiveCallId: (id) => set({ activeCallId: id }),
}));