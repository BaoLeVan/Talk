import { toast } from "react-toastify";
import { create } from "zustand";
import {
  getFriends,
  getReceivedRequests,
} from "~/apis/friendApi";
import { useChatStore } from "~/store/useChatStore";

export const useFriendStore = create((set, get) => ({
  receivedRequests: [],
  sentRequests: [],
  friends: [],
  loading: false,
  setLoading: (loading) => set({ loading }),

  fetchReceivedRequests: async () => {
    set({ loading: true });
    try {
      const data = await getReceivedRequests();
      set({ receivedRequests: data });
    } finally {
      set({ loading: false });
    }
  },

  fetchFriends: async () => {
    set({ loading: true });
    try {
      const data = await getFriends();
      set({ friends: data });
    } finally {
      set({ loading: false });
    }
  },

  sendFriendRequestAction: (sendMessage) => (receiverId, message) => {
    sendMessage("/app/friend.sendRequest", { receiverId, message });
  },

  acceptRequest: (sendMessage) => (requestId) => {
    sendMessage("/app/friend.acceptRequest", requestId);
  },

  rejectRequest: (sendMessage) => (requestId) => {
    sendMessage("/app/friend.rejectRequest", requestId);
  },

  cancelRequest: (sendMessage) => (requestId) => {
    sendMessage("/app/friend.cancelRequest", requestId);
  },

  unfriendAction: (sendMessage) => (friendUserId) => {
    sendMessage("/app/friend.unfriend", friendUserId);
  },

  handleRealtimeNotification: (notification) => {
    if (!notification) return;
    const { type, friendRequest } = notification;

    if (type === "FRIEND_REQUEST_RECEIVED" && friendRequest) {
      set((state) => ({
        receivedRequests: [friendRequest, ...state.receivedRequests.filter((r) => r.id !== friendRequest.id)],
      }));
    }

    if (type === "FRIEND_REQUEST_CANCELLED" && friendRequest) {
      set((state) => ({
        receivedRequests: state.receivedRequests.filter((r) => r.id !== friendRequest.id),
      }));
    }

    if (type === "FRIEND_REQUEST_ACCEPTED" && friendRequest) {
      set((state) => ({
        sentRequests: state.sentRequests.filter((r) => r.id !== friendRequest.id),
      }));
      get().fetchFriends();
      useChatStore.getState().fetchConversations(friendRequest.senderId, "");
    }

    if (type === "FRIEND_REQUEST_ACCEPTED_BY_ME" && friendRequest) {
      set((state) => ({
        receivedRequests: state.receivedRequests.filter((r) => r.id !== friendRequest.id),
      }));
      get().fetchFriends();
      useChatStore.getState().fetchConversations(friendRequest.receiverId, "");
    }

    if (type === "FRIEND_REQUEST_REJECTED" && friendRequest) {
      set((state) => ({
        sentRequests: state.sentRequests.filter((r) => r.id !== friendRequest.id),
      }));
    }

    if (type === "FRIEND_REQUEST_REJECTED_BY_ME" && friendRequest) {
      set((state) => ({
        receivedRequests: state.receivedRequests.filter((r) => r.id !== friendRequest.id),
      }));
    }

    if (type === "UNFRIENDED" || type === "UNFRIENDED_BY_ME") {
      get().fetchFriends();
      toast.success("Đã huỷ kết bạn thành công");
    }
  },
}));
