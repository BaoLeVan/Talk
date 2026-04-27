import { Avatar, Badge, Box, FormControl, IconButton, Input, InputAdornment, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Typography } from '@mui/material'
import React, { useState } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { LogoutOutlined, Search } from '@mui/icons-material';
import { formatDate, formatTime } from '~/utils/common';
import { useNavigate } from 'react-router';

function SideBar({ selectedIndex, onSelectConversation, setConversation }) {
  const navigate = useNavigate();
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
    unreadCount: 5,
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

  const handleLogout = () => {
    navigate('/login')
  }

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
              <ListItem sx={{ width: '100%' }}>

                {/* 1 */}
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src={conversation.avatar} />
                  </ListItemAvatar>
                </Box>

                {/* 3 */}
                <Box sx={{ flex: 4 }}>
                  <ListItemText
                    primary={
                      conversation.unreadCount > 0 ? <Typography sx={{
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        lineHeight: '1.5',
                        color: 'text.secondary'
                      }} >{conversation.title}</Typography> : conversation.title
                    }
                    secondary={
                      conversation.userID === userID
                        ? `You: ${conversation.lastMessage} • ${conversation.lastMessageAt}`
                        : (
                          conversation.unreadCount > 0 ?
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{
                                color: 'text.secondary'
                              }}
                            >
                              {conversation.lastMessage + ' • ' + conversation.lastMessageAt}
                            </Typography> :
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{
                                color: 'text.primary',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {conversation.lastMessage + ' • ' + conversation.lastMessageAt}
                            </Typography>
                        )
                    }
                  />
                </Box>

                {/* 1 */}
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Badge
                    badgeContent={conversation.unreadCount}
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '0.8rem',
                        height: '20px',
                        fontWeight: 'bold'
                      }
                    }}
                  />
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
          <IconButton size="large" onClick={handleLogout}>
            <LogoutOutlined></LogoutOutlined>
          </IconButton>
        </Box>
      </Box>
    </Paper>
  )
}

export default SideBar