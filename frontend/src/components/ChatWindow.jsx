import React from 'react'
import { Box, Typography } from '@mui/material'

function ChatWindow() {
  return (
    <Box sx={{ 
      height: '100%', 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: '#f8f9fa' 
    }}>
      <Typography variant="h5" color="text.secondary">Select a conversation to start chatting</Typography>
    </Box>
  )
}

export default ChatWindow