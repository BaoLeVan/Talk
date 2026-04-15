import { Avatar, Badge, Box, FormControl, IconButton, Input, InputAdornment, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Typography } from '@mui/material'
import React, { useState } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { LogoutOutlined, Search } from '@mui/icons-material';
import { formatDate, formatTime } from '~/utils/common';

function SideBar({ selectedIndex, onSelectConversation, setConversation }) {
  const userID = 1;
  const [conversations, setConversations] = useState([{
    id: 1,
    avatar: 'https://i.pravatar.cc/150?u=1',
    title: 'John Doe',
    type: 'GROUP',
    lastMessage: 'Hello',
    lastMessageAt: formatDate(new Date()),
    unreadCount: 0,
    userID: 1,
    isOnline: false
  }, {
    id: 2,
    avatar: 'https://i.pravatar.cc/150?u=2',
    title: 'Jane Doe',
    type: 'PRIVATE',
    lastMessage: 'Hello',
    lastMessageAt: formatTime(new Date()),
    unreadCount: 0,
    userID: 1,
    isOnline: false
  }, {
    id: 3,
    avatar: 'https://i.pravatar.cc/150?u=3',
    title: 'John Doe',
    type: 'PRIVATE',
    lastMessage: 'Hello',
    lastMessageAt: formatDate(new Date()),
    unreadCount: 0,
    userID: 3,
    isOnline: false
  }, {
    id: 4,
    avatar: 'https://i.pravatar.cc/150?u=4',
    title: 'Jane Doe',
    type: 'GROUP',
    lastMessage: 'Hello',
    lastMessageAt: formatTime(new Date()),
    unreadCount: 0,
    userID: 4,
    isOnline: false
  }, {
    id: 5,
    avatar: 'https://i.pravatar.cc/150?u=5',
    title: 'John Doe',
    type: 'PRIVATE',
    lastMessage: 'Hello',
    lastMessageAt: formatTime(new Date()),
    unreadCount: 0,
    userID: 5,
    isOnline: false
  }, {
    id: 6,
    avatar: 'https://i.pravatar.cc/150?u=6',
    title: 'Jane Doe',
    type: 'GROUP',
    lastMessage: 'Hello',
    lastMessageAt: formatDate(new Date()),
    unreadCount: 0,
    userID: 6,
    isOnline: false
  }, {
    id: 7,
    avatar: 'https://i.pravatar.cc/150?u=7',
    title: 'John Doe',
    type: 'PRIVATE',
    lastMessage: 'Hello',
    lastMessageAt: formatTime(new Date()),
    unreadCount: 0,
    userID: 1,
    isOnline: false
  }, {
    id: 8,
    avatar: 'https://i.pravatar.cc/150?u=8',
    title: 'Jane Doe',
    type: 'GROUP',
    lastMessage: 'Hello',
    lastMessageAt: formatDate(new Date()),
    unreadCount: 0,
    userID: 1,
    isOnline: false
  }]);

  const handleListItemClick = (event, index) => {
    onSelectConversation(index);
    const result = conversations.find((data) => data.id === index);
    setConversation(result)
  };

  return (
    <Paper sx={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{
        px: 2,
        py: 3,
        borderBottom: '1px solid #e0e0e0',
        flexShrink: 0
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant='h5' sx={{ fontWeight: 'bold' }}>Messages</Typography>
          <IconButton size="large">
            <AddCircleIcon fontSize='inherit' />
          </IconButton>
        </Box>
        <Box>
          <FormControl
            fullWidth
          >
            <Input
              placeholder='Search conversations...'
              sx={{
                borderRadius: '20px',
                backgroundColor: 'oklch(0.967 0.003 264.542)',
                height: '40px',
                pl: 2,
                lineHeight: '1.5',
                fontSize: '1rem',
                fontWeight: '400'
              }}
              disableUnderline
              startAdornment={
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <List
          sx={{
            width: '100%',
            height: '100%',
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'auto',
          }}>
          {conversations.map((conversation, index) => (
            <ListItemButton
              sx={{ p: 0 }}
              selected={selectedIndex === index}
              onClick={(event) => handleListItemClick(event, index)}
              key={index}
            >
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src={conversation.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={conversation.title}
                  secondary={
                    <React.Fragment>
                      {conversation.userID === userID ? `You: ${conversation.lastMessage} • ${conversation.lastMessageAt}` : <Typography
                        component="span"
                        variant="body2"
                        sx={{ color: 'text.primary', display: 'inline' }}
                      >
                        {conversation.lastMessage + ' • ' + conversation.lastMessageAt}
                      </Typography>}
                    </React.Fragment>
                  }
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant='caption' sx={{ color: 'text.secondary', mb: 1.5, mt: 1 }}>2m</Typography>
                  <Badge sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.8rem',
                      height: '20px',
                      fontWeight: 'bold',
                    }
                  }}
                    badgeContent={100}
                    color="primary"></Badge>
                </Box>
              </ListItem>
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2,
        py: 2,
        borderTop: '1px solid #e0e0e0',
        flexShrink: 0
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          <Typography>User Name</Typography>
        </Box>
        <Box>
          <IconButton size="large">
            <LogoutOutlined></LogoutOutlined>
          </IconButton>
        </Box>
      </Box>
    </Paper>
  )
}

export default SideBar