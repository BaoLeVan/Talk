import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import MessageInput from './MessageInput'
import HeaderChat from './HeaderChat'
import MessageItem from './MessageItem'
import { TYPE_MESSAGE } from '~/utils/common'

function ChatWindow({ conversation }) {
  const [messages, setMessages] = useState({
    content: '' || [],
    time: '',
    isOwnMessage: false,
    senderName: '',
    avatar: '',
    showAvatar: false,
    status: '',
    type: TYPE_MESSAGE.TEXT || TYPE_MESSAGE.IMAGE || TYPE_MESSAGE.VIDEO || TYPE_MESSAGE.FILE
  })

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
        <HeaderChat />
      </Box>
      <Box sx={{ flexGrow: 1, height: 0, width: '100%', overflowY: 'auto', py: 2 }}>
        <MessageItem messages={messages} setMessages={setMessages} />
      </Box>
      <Box sx={{ width: '100%', bgcolor: 'white' }}>
        <MessageInput setMessages={setMessages} />
      </Box>
    </Box>
  )
}

export default ChatWindow