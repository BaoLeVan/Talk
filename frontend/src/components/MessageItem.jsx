import React, { useEffect, useState } from 'react'
import { Box, Typography, Avatar } from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll'

function MessageItem({ messages, setMessages }) {
  const [dataDump, setDataDump] = useState([{
    text: 'Example message content',
    time: '10:00',
    isOwnMessage: false,
    senderName: 'Huy',
    avatar: 'https://mui.com/static/images/avatar/2.jpg',
    showAvatar: true,
    status: 'read'
  },
  {
    text: 'Example message content',
    time: '10:00',
    isOwnMessage: true,
    senderName: 'Bao',
    avatar: 'https://mui.com/static/images/avatar/3.jpg',
    showAvatar: true,
    status: 'read'
  },
  {
    text: 'Example message content',
    time: '10:00',
    isOwnMessage: false,
    senderName: 'Alex',
    avatar: 'https://mui.com/static/images/avatar/1.jpg',
    showAvatar: true,
    status: 'read'
  },
  {
    text: 'Example message content',
    time: '10:00',
    isOwnMessage: false,
    senderName: 'Alex',
    avatar: 'https://mui.com/static/images/avatar/1.jpg',
    showAvatar: true,
    status: 'read'
  }]);

  useEffect(() => {
    if (messages && messages.text) {
      setDataDump((prev) => [...prev, messages])
    }
  }, [messages])

  return (
    <>
      {dataDump.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: item.isOwnMessage ? 'row-reverse' : 'row',
            alignItems: 'flex-start',
            mb: 2,
            px: 2,
            gap: 1.5,
          }}
        >
          {/* Avatar space for received messages */}
          {!item.isOwnMessage && (
            <Box sx={{ width: 40, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {item.showAvatar && (
                <Avatar src={item.avatar} alt={item.senderName || 'Avatar'} sx={{ width: 40, height: 40 }} />
              )}
            </Box>
          )}

          {/* Message content container */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: item.isOwnMessage ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>

            {/* Sender Name */}
            {!item.isOwnMessage && item.showAvatar && item.senderName && (
              <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, ml: 1, fontSize: '0.75rem' }}>
                {item.senderName}
              </Typography>
            )}

            {/* Chat Bubble */}
            <Box
              sx={{
                py: 1,
                px: 2,
                bgcolor: item.isOwnMessage ? '#1472ff' : '#f0f2f5', // Blue for own, light grey for received
                color: item.isOwnMessage ? 'white' : 'text.primary',
                borderRadius: '20px',
                wordWrap: 'break-word',
                boxShadow: 'none',
              }}
            >
              <Typography variant="body1" sx={{ fontSize: '0.9375rem', lineHeight: 1.4 }}>
                {item.text}
              </Typography>
            </Box>

            {/* Time and Read Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 0.5, px: 1 }}>
              {item.isOwnMessage && item.status === 'read' && (
                <DoneAllIcon sx={{ fontSize: 16, color: '#1472ff' }} />
              )}
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                {item.time}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))
      }
    </>
  )
}

export default MessageItem