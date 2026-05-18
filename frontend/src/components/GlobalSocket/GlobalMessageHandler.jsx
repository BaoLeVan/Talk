import { useEffect, useRef } from 'react';
import { useStomp } from '../context/StompContext';
import { useChatStore } from '~/store/useChatStore';
import { useUser } from '../context/UserContext';

export default function GlobalMessageHandler() {
  const { connected, subscribe, unsubscribe } = useStomp();
  const { conversations, currentConversationId, updateConversationOnNewMessage, addMessage, updateMessageReactions } = useChatStore();
  const { user } = useUser();
  const subscriptionsRef = useRef(new Map());

  useEffect(() => {
    if (!connected || !conversations.length) return;

    conversations.forEach(conv => {
      const topic = `/topic/room.${conv.conversationId}`;
      if (subscriptionsRef.current.has(topic)) return;

      const callback = (data) => {
        const message = JSON.parse(data.body);
        const isCurrent = currentConversationId === conv.conversationId;

        // reaction update — chỉ cập nhật reactions, không thêm message mới
        if (message.status === 'REACTED') {
          if (isCurrent) {
            updateMessageReactions(message.idMessage, message.reactions || []);
          }
          return;
        }

        updateConversationOnNewMessage(
          conv.conversationId,
          message,
          isCurrent,
          user?.id
        );

        if (isCurrent && message.messageType !== 'SYSTEM' && message.status !== 'EDITED') {
          addMessage({
            id: message?.idMessage,
            conversationId: message?.conversationId,
            content: message?.content,
            updateAt: new Date(message?.createdAt || message?.timestamp).toLocaleString(),
            isOwnMessage: message?.user?.id === user?.id,
            senderName: message?.user?.userName,
            avatar: message?.user?.avatar,
            status: message?.status?.toLowerCase(),
            attachments: message?.attachments || [],
            messageType: message?.messageType,
            action: message?.action,
            reactions: message?.reactions || [],
          });
        }
      };

      subscribe(topic, callback);
      subscriptionsRef.current.set(topic, callback);
    });

    return () => {
      subscriptionsRef.current.forEach((_, topic) => {
        unsubscribe(topic);
      });
      subscriptionsRef.current.clear();
    };
  }, [connected, conversations, currentConversationId, user?.id, updateConversationOnNewMessage, addMessage, updateMessageReactions, subscribe, unsubscribe]);

  return null;
}
