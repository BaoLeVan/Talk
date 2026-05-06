import React, { useCallback, useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import MessageInput from './MessageInput'
import HeaderChat from './HeaderChat'
import MessageItem from './MessageItem'
import { getMessagesByConversationId, getListMemberByConversationId } from '~/apis'
import { useUser } from './context/UserContext'
import { useStomp } from '~/hooks/useStomp'
import moment from 'moment'
import { useChatStore } from './store/useChatStore'

function ChatWindow({ conversation }) {
  const { user } = useUser();
  const { messages, setMessages, addMessage } = useChatStore();

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
    })

    if (isSystemMessage && shouldRefreshMembers && conversation?.conversationId) {
      getListMemberByConversationId(conversation.conversationId).then(result => {
        if (result) {
          useChatStore.getState().setMembers(result.data);
        }
      });
    }
  }, [user?.id, conversation?.conversationId])

  const { connected, subscribeRoom, unsubscribeRoom, sendMessage } = useStomp();

  useEffect(() => {
    if (conversation && connected) {
      subscribeRoom(conversation?.conversationId, handleMessageReceived);
    }

    return () => {
      if (conversation?.conversationId) {
        unsubscribeRoom(conversation.conversationId);
      }
    };
  }, [conversation?.conversationId, connected, subscribeRoom, unsubscribeRoom, handleMessageReceived]);

  useEffect(() => {
    if (conversation) {
      const getMessages = async () => {
        const result = await getMessagesByConversationId({
          cursor: null,
          conversationId: conversation.conversationId
        });
        if (result) {
          const messages = result.data.messages;
          const messageContent = messages.map((message) => {
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
        bgcolor: '#ffffff',
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 400,
          p: 3
        }}>
          {/* Chat Icon Appears 3D via drop-shadow */}
          <Box sx={{
            fontSize: '5rem',
            mb: 2,
            lineHeight: 1,
            filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.1))'
          }}>
            💬
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 1.5 }}>
            Welcome to Chat
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mb: 4, lineHeight: 1.6 }}>
            Select a conversation from the sidebar to start messaging with your contacts
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#64748b' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#00ba61' }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>Online</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>•</Typography>
            <Typography variant="body2">3 contacts available</Typography>
            {/* <Typography variant="body2">{conversations.filter(c => c.isOnline).length} contacts available</Typography> */}
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#f8f9fa',
    }}>
      <Box sx={{ width: '100%', bgcolor: 'white' }}>
        <HeaderChat conversation={conversation} />
      </Box>
      <Box sx={{ flexGrow: 1, height: 0, width: '100%', overflowY: 'auto', py: 2 }}>
        <MessageItem />
      </Box>
      <Box sx={{ width: '100%', bgcolor: 'white' }}>
        <MessageInput conversation={conversation} sendMessage={sendMessage} />
      </Box>
    </Box>
  )
}

export default ChatWindow