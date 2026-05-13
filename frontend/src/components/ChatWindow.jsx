import React, { useCallback, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import MessageInput from './MessageInput'
import HeaderChat from './HeaderChat'
import MessageItem from './MessageItem'
import { getMessagesByConversationId, getListMemberByConversationId } from '~/apis'
import { useUser } from './context/UserContext'
import { useStomp } from '~/components/context/StompContext'
import moment from 'moment'
import { useChatStore } from '~/store/useChatStore'

function ChatWindow({ conversation }) {
  const { user } = useUser();
  const { setMessages, addMessage } = useChatStore();

  const handleMessageReceived = useCallback((message) => {
    const isSystemMessage = message?.messageType === 'SYSTEM';
    const shouldRefreshMembers = ['REMOVE_MEMBER', 'LEAVE', 'JOIN', 'ADD_MEMBER'].includes(message?.action);

    addMessage({
      content: message?.content,
      time: moment(message?.updatedAt || message?.createdAt || message?.timestamp).format('dddd h:mm A'),
      isOwnMessage: isSystemMessage ? false : message?.user?.id === user?.id,
      senderName: isSystemMessage ? null : message?.user?.userName,
      avatar: isSystemMessage ? null : message?.user?.avatar,
      status: message?.status,
      attachments: message?.attachments || [],
      messageType: message?.messageType,
      action: message?.action
    });

    if (isSystemMessage && shouldRefreshMembers && conversation?.conversationId) {
      getListMemberByConversationId(conversation.conversationId).then(result => {
        if (result) useChatStore.getState().setMembers(result.data);
      });
    }
  }, [user?.id, conversation?.conversationId]);

  const { connected, subscribeRoom, unsubscribeRoom, sendMessage } = useStomp();

  useEffect(() => {
    if (conversation && connected) {
      subscribeRoom(conversation?.conversationId, handleMessageReceived);
    }
    return () => {
      if (conversation?.conversationId) unsubscribeRoom(conversation.conversationId);
    };
  }, [conversation?.conversationId, connected, subscribeRoom, unsubscribeRoom, handleMessageReceived]);

  useEffect(() => {
    if (conversation) {
      const getMessages = async () => {
        const result = await getMessagesByConversationId({ cursor: null, conversationId: conversation.conversationId });
        if (result) {
          const messageContent = result.data.messages.map((message) => {
            const isSystemMessage = message?.messageType === 'SYSTEM';
            return {
              content: message?.content,
              time: moment(message?.updatedAt).format('dddd h:mm A'),
              isOwnMessage: isSystemMessage ? false : message?.user?.id === user?.id,
              senderName: isSystemMessage ? null : message?.user?.userName,
              avatar: isSystemMessage ? null : message?.user?.avatar,
              status: message?.status,
              attachments: message?.attachments || [],
              messageType: message?.messageType,
              action: message?.action
            };
          });
          setMessages(messageContent);
        }
      }
      getMessages();
    }
  }, [conversation, user?.id]);

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
      bgcolor: '#FFFFFF',
    }}>
      <Box sx={{ flexShrink: 0 }}>
        <HeaderChat conversation={conversation} />
      </Box>
      <Box sx={{
        flexGrow: 1,
        height: 0,
        overflowY: 'auto',
        py: 2,
        px: 1,
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FF 100%)',
      }}>
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
