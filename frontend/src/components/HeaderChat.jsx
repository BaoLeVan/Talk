import { Avatar, Box, IconButton, Typography } from '@mui/material'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function HeaderChat({ conversation, rightPanelOpen, setRightPanelOpen }) {

  const handleRightPanelToggle = () => {
    setRightPanelOpen(!rightPanelOpen);
  };

  return (
    <Box sx={{
      height: '90px',
      display: 'flex',
      px: 3,
      alignItems: 'center',
      bgcolor: '#FFFFFF',
      borderBottom: '1px solid #EEF2FF'
    }}>
      <Box sx={{ position: 'relative', mr: 2 }}>
        <Avatar
          src={conversation.conversationType === 'GROUP' ? conversation.conversationAvatar : conversation.userAvatar}
          sx={{ width: 52, height: 52, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
        />
        {
          (conversation?.conversationType === 'GROUP' || conversation?.userIsOnline) && (
            <Box sx={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 11,
              height: 11,
              borderRadius: '999px',
              bgcolor: '#22C55E',
              border: '2px solid #FFFFFF'
            }} />
          )
        }
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>
          {conversation.conversationType === 'GROUP' ? conversation.conversationTitle : conversation.userName}
        </Typography>
        {(conversation?.conversationType === 'GROUP' || conversation?.userIsOnline) && (
          <Typography sx={{ fontSize: '13px', color: '#22C55E', fontWeight: 500 }}>Trực tuyến</Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            bgcolor: '#F8F9FC',
            color: '#6B7280',
            transition: 'all 0.2s ease',
            '&:hover': { bgcolor: '#EEF2FF', color: '#5B67FF', transform: 'scale(1.02)' }
          }}
        >
          <VideocamIcon fontSize='small' key='v' />
        </IconButton>
        <IconButton
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            bgcolor: '#F8F9FC',
            color: '#6B7280',
            transition: 'all 0.2s ease',
            '&:hover': { bgcolor: '#EEF2FF', color: '#5B67FF', transform: 'scale(1.02)' }
          }}
        >
          <CallIcon fontSize='small' key='v' />
        </IconButton>
        <IconButton
          onClick={handleRightPanelToggle}
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            bgcolor: '#F8F9FC',
            color: '#6B7280',
            transition: 'all 0.2s ease',
            '&:hover': { bgcolor: '#EEF2FF', color: '#5B67FF', transform: 'scale(1.02)' }
          }}
        >
          <MoreHorizIcon fontSize='small' key='m' />
        </IconButton>
      </Box>
    </Box>
  )
}

export default HeaderChat
