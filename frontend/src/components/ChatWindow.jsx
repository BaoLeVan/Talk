import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import MessageInput from './MessageInput'
import HeaderChat from './HeaderChat'
import MessageItem from './MessageItem'
import { getMessagesByConversationId } from '~/apis'
import { useUser } from './context/UserContext'
import { useStomp } from '~/components/context/StompContext'
import moment from 'moment'
import { useChatStore } from '~/store/useChatStore'
import { COLORS } from '~/utils/common'

function ChatWindow({ conversation, rightPanelOpen, setRightPanelOpen }) {
  const { user } = useUser();
  const { messages, setMessages, markConversationRead, setCurrentConversationId, clearEditingMessage } = useChatStore();
  const { sendMessage } = useStomp();
  const messagesContainerRef = useRef(null);
  const isLoadingOlderRef = useRef(false);
  const skipNextAutoScrollRef = useRef(false);
  const previousMessagesLengthRef = useRef(0);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);

  const mapMessages = useCallback((rawMessages = []) => rawMessages.map((message) => {
    const isSystemMessage = message?.messageType === 'SYSTEM';
    return {
      id: message?.idMessage,
      content: message?.content,
      updateAt: moment(message?.updatedAt).format('dddd h:mm A'),
      isOwnMessage: isSystemMessage ? false : message?.user?.id === user?.id,
      senderName: isSystemMessage ? null : message?.user?.userName,
      avatar: isSystemMessage ? null : message?.user?.avatar,
      status: message?.status?.toLowerCase(),
      attachments: message?.attachments || [],
      messageType: message?.messageType,
      action: message?.action
    };
  }), [user?.id]);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = messagesContainerRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, []);

  useEffect(() => {
    setCurrentConversationId(conversation?.conversationId ?? null);
    return () => setCurrentConversationId(null);
  }, [conversation?.conversationId, setCurrentConversationId]);

  useEffect(() => {
    clearEditingMessage();
  }, [conversation?.conversationId, clearEditingMessage]);

  useEffect(() => {
    if (!conversation?.conversationId) {
      setMessages([]);
      setNextCursor(null);
      setHasNext(false);
      return;
    }

    let ignore = false;

    const getMessages = async () => {
      const result = await getMessagesByConversationId({
        cursor: null,
        conversationId: conversation.conversationId,
        size: 25,
      });

      if (ignore || !result) return;

      const rawMessages = result.data?.messages || [];
      setMessages(mapMessages(rawMessages));
      setNextCursor(result.data?.nextCursor || null);
      setHasNext(Boolean(result.data?.hasNext));
      previousMessagesLengthRef.current = rawMessages.length;

      if (rawMessages.length > 0) {
        const lastMessageId = rawMessages[rawMessages.length - 1].idMessage;

        sendMessage('/app/chat.markRead', {
          conversationId: conversation.conversationId,
          lastReadMessageId: lastMessageId,
        });
        markConversationRead(conversation.conversationId);
      }

      scrollToBottom();
    };

    getMessages();

    return () => {
      ignore = true;
    };
  }, [conversation?.conversationId, mapMessages, markConversationRead, scrollToBottom, sendMessage, setMessages]);

  const loadOlderMessages = useCallback(async () => {
    const el = messagesContainerRef.current;
    if (!conversation?.conversationId || !hasNext || !nextCursor || isLoadingOlderRef.current || messages.length < 25) return;

    isLoadingOlderRef.current = true;
    setIsLoadingOlder(true);

    const previousScrollHeight = el?.scrollHeight || 0;
    const previousScrollTop = el?.scrollTop || 0;

    try {
      const result = await getMessagesByConversationId({
        cursor: nextCursor,
        conversationId: conversation.conversationId,
        size: 25,
      });

      if (!result) return;

      const olderMessages = mapMessages(result.data?.messages || []);
      skipNextAutoScrollRef.current = true;
      setMessages([...olderMessages, ...useChatStore.getState().messages]);
      setNextCursor(result.data?.nextCursor || null);
      setHasNext(Boolean(result.data?.hasNext));

      requestAnimationFrame(() => {
        const currentEl = messagesContainerRef.current;
        if (!currentEl) return;
        currentEl.scrollTop = currentEl.scrollHeight - previousScrollHeight + previousScrollTop;
      });
    } finally {
      isLoadingOlderRef.current = false;
      setIsLoadingOlder(false);
    }
  }, [conversation?.conversationId, hasNext, mapMessages, messages.length, nextCursor, setMessages]);

  const handleMessagesScroll = useCallback((event) => {
    const el = event.currentTarget;
    if (el.scrollTop <= 80) loadOlderMessages();
  }, [loadOlderMessages]);

  useEffect(() => {
    const previousLength = previousMessagesLengthRef.current;

    if (skipNextAutoScrollRef.current) {
      skipNextAutoScrollRef.current = false;
      previousMessagesLengthRef.current = messages.length;
      return;
    }

    if (!isLoadingOlderRef.current && messages.length > previousLength) {
      scrollToBottom();
    }

    previousMessagesLengthRef.current = messages.length;
  }, [messages.length, scrollToBottom]);

  if (!conversation) {
    return (
      <Box sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #FFFFFF 0%, #F3F5FF 100%)',
      }}>
        <Box sx={{
          background: 'linear-gradient(160deg, #FFFFFF 0%, #F3F5FF 100%)',
          borderRadius: '28px',
          padding: '40px 48px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 380,
        }}>
          <Box sx={{
            fontSize: '5rem',
            mb: 2.5,
            lineHeight: 1,
            filter: 'drop-shadow(0px 12px 16px rgba(91,103,255,0.25))'
          }}>
            💬
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '28px', color: '#111827', mb: 1.5, letterSpacing: '-0.5px' }}>
            Chào mừng bạn!
          </Typography>
          <Typography sx={{ fontSize: '15px', color: '#6B7280', mb: 3.5, lineHeight: 1.6 }}>
            Kết nối và trò chuyện cùng mọi người ngay bây giờ.
          </Typography>
          <Box sx={{
            width: '100%',
            py: 1.5,
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #6EA8FE 0%, #5B67FF 50%, #7C5CFF 100%)',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '15px',
            textAlign: 'center',
            cursor: 'default',
            boxShadow: '0 8px 20px rgba(91,103,255,0.3)',
          }}>
            Chọn cuộc trò chuyện để bắt đầu
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#FFFFFF'
    }}>
      <Box sx={{ flexShrink: 0 }}>
        <HeaderChat conversation={conversation} rightPanelOpen={rightPanelOpen} setRightPanelOpen={setRightPanelOpen} />
      </Box>
      <Box
        ref={messagesContainerRef}
        onScroll={handleMessagesScroll}
        sx={{
          flexGrow: 1,
          height: 0,
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          py: 2,
          px: 1,
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FF 100%)',
        }}
      >
        {isLoadingOlder && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress size={28} sx={{ color: COLORS.primary }} />
          </Box>
        )}
        <MessageItem />
      </Box>
      <Box sx={{
        flexShrink: 0,
        bgcolor: '#FFFFFF',
        borderTop: '1px solid #EEF2FF',
        px: 2,
        py: 1.5,
      }}>
        <MessageInput conversation={conversation} sendMessage={sendMessage} />
      </Box>
    </Box>
  )
}

export default ChatWindow
