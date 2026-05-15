import { create } from 'zustand';
import { getAllConversationsByUser } from '~/apis';

export const useChatStore = create((set) => ({
    messages: [],
    members: [],
    conversations: [],
    isLoading: false,
    currentConversationId: null,

    setMembers: (members) => set({ members }),
    setMessages: (messages) => set({ messages }),
    setConversations: (conversations) => set({ conversations }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setCurrentConversationId: (id) => set({ currentConversationId: id }),

    addMessage: (msg) =>
        set(state => ({ messages: [...state.messages, msg] })),

    removeMember: (userId) =>
        set((state) => ({
            members: state.members.filter(u => u.id !== userId)
        })),

    markConversationRead: (conversationId) =>
        set(state => ({
            conversations: state.conversations.map(c =>
                c.conversationId === conversationId ? { ...c, conversationUnreadCount: 0 } : c
            )
        })),

    updateConversationOnNewMessage: (conversationId, newMessage, isCurrentConversation, currentUserId) =>
        set(state => ({
            conversations: state.conversations.map(conv => {
                if (conv.conversationId !== conversationId) return conv;
                const updated = { ...conv };
                updated.conversationLastSenderId = newMessage.user.id;
                updated.conversationLastSenderName = newMessage.user.userName;
                updated.conversationLastMessage = newMessage.content;
                updated.conversationLastMessageAt = newMessage.createdAt || newMessage.timestamp;
                if (
                    !isCurrentConversation &&
                    newMessage.senderId !== currentUserId &&
                    newMessage.messageType !== 'SYSTEM'
                ) {
                    updated.conversationUnreadCount = (updated.conversationUnreadCount || 0) + 1;
                }
                return updated;
            })
        })),

    fetchConversations: async (userId, value) => {
        set({ isLoading: true });
        try {
            const result = await getAllConversationsByUser(userId, value);
            console.log(result);
            
            if (result) set({ conversations: result.data });
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
        } finally {
            set({ isLoading: false });
        }
    },
}));