import { create } from 'zustand';
import { getAllConversationsByUser } from '~/apis';

export const useChatStore = create((set) => ({
    messages: [],
    members: [],
    conversations: [],
    isLoading: false,

    setMembers: (members) => set({ members }),
    setMessages: (messages) => set({ messages }),
    setConversations: (conversations) => set({ conversations }),
    setIsLoading: (isLoading) => set({ isLoading }),

    addMessage: (msg) =>
        set(state => ({ messages: [...state.messages, msg] })),

    removeMember: (userId) =>
        set((state) => ({
            members: state.members.filter(u => u.id !== userId)
        })),

    fetchConversations: async (userId, value) => {
        set({ isLoading: true });
        try {
            const result = await getAllConversationsByUser(userId, value);
            if (result) set({ conversations: result.data });
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
        } finally {
            set({ isLoading: false });
        }
    },
}));