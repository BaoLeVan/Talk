import { useEffect, useRef } from 'react';
import { useStomp } from '../context/StompContext';
import { useChatStore } from '~/store/useChatStore';
import { useUser } from '../context/UserContext';

export default function GlobalMessageHandler() {
  const { connected, subscribe, unsubscribe } = useStomp();
  const { conversations, currentConversationId, updateConversationOnNewMessage, addMessage } = useChatStore();
  const { user } = useUser();
  const subscriptionsRef = useRef(new Map());

  useEffect(() => {
    if (!connected || !conversations.length) return;

    // Subscribe to all conversation rooms
    conversations.forEach(conv => {
      const topic = `/topic/room.${conv.conversationId}`;
      if (subscriptionsRef.current.has(topic)) return;

      const callback = (data) => {
        const message = JSON.parse(data.body);
        const isCurrent = currentConversationId === conv.conversationId;
        updateConversationOnNewMessage(
          conv.conversationId,
          message,
          isCurrent,
          user?.id
        );

        if (isCurrent && message.messageType !== 'SYSTEM' && message.status !== 'EDITED') {
          addMessage({
            content: message?.content,
            updateAt: new Date(message?.createdAt || message?.timestamp).toLocaleString(),
            isOwnMessage: message?.user?.id === user?.id,
            senderName: message?.user?.userName,
            avatar: message?.user?.avatar,
            status: message?.status?.toLowerCase(),
            attachments: message?.attachments || [],
            messageType: message?.messageType,
            action: message?.action
          });
        }
      };

      subscribe(topic, callback);
      subscriptionsRef.current.set(topic, callback);
    });

    // Cleanup: unsubscribe from rooms that are no longer in conversations
    return () => {
      subscriptionsRef.current.forEach((callback, topic) => {
        unsubscribe(topic);
      });
      subscriptionsRef.current.clear();
    };
  }, [connected, conversations, currentConversationId, user?.id, updateConversationOnNewMessage, addMessage, subscribe, unsubscribe]);

  return null;
}
