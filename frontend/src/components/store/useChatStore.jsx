import { create } from 'zustand';

export const useChatStore = create((set) => ({
    messages: [],
    members: [],

    setMembers: (members) => set({ members }),
    setMessages: (messages) => set({ messages }),

    addMessage: (msg) =>
        set(state => ({ messages: [...state.messages, msg] })),

    removeMember: (userId) =>
        set((state) => ({
            members: state.members.filter(u => u.id !== userId)
        })),
}));