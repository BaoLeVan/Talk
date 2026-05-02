import { Avatar, Badge, Box, CircularProgress, FormControl, IconButton, Input, InputAdornment, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { LogoutOutlined, Search } from '@mui/icons-material';
import { formatTimeChat } from '~/utils/common';
import { useNavigate } from 'react-router';
import { getAllConversationsByUser, logout, setAccessToken } from '~/apis';
import { toast } from 'react-toastify';
import { useUser } from '~/components/context/UserContext';
import useDebounce from './customHook/useDebounce';

function SideBar({ selectedIndex, onSelectConversation, setConversation }) {
  const navigate = useNavigate();
  const [searchConversation, setSearchConversation] = useState('');
  const { user, isLoading, setIsLoading } = useUser();
  const [conversations, setConversations] = useState([]);

  const debouncedValue = useDebounce(searchConversation, 500);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const getAllConversations = async () => {
        const result = await getAllConversationsByUser(user.id, debouncedValue);
        if (result) {
          setConversations(result.data);
        }
        setIsLoading(false);
      }
      getAllConversations();
    }
  }, [user, debouncedValue]);

  const handleLogout = async () => {
    setAccessToken(null);
    const result = await logout();
    if (result?.message) {
      toast.success(result.message);
    }
    localStorage.removeItem('user');
    navigate('/login');
  }

  const handleListItemClick = (event, index) => {
    onSelectConversation(index);
    const result = conversations.find((data) => data.id === index);
    setConversation(result);
  };

  const handleSearch = (event) => {
    setSearchConversation(event.target.value);
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
              onChange={(event) => handleSearch(event)}
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
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : conversations?.map((conversation) => (
            <ListItemButton
              sx={{ p: 0 }}
              selected={selectedIndex === conversation.id}
              onClick={(event) => handleListItemClick(event, conversation.id)}
              key={conversation.id}
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
                      conversation.userID === user?.id
                        ? `You: ${conversation.lastMessage} • ${conversation.lastMessageAt}`
                        : (
                          conversation.unreadCount > 0 ?
                            <span style={{ display: 'flex' }} >
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                  color: 'text.secondary',
                                  display: 'inline-block',
                                  maxWidth: '80%',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {conversation.lastMessage}
                              </Typography>
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                  color: 'text.secondary'
                                }}>
                                {' • ' + formatTimeChat(conversation.lastMessageAt)}
                              </Typography>
                            </span>
                            :
                            <span style={{ display: 'flex' }}>
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                  color: 'text.primary',
                                  display: 'inline-block',
                                  maxWidth: '80%',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {conversation.lastMessage}
                              </Typography>
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                  color: 'text.primary'
                                }}>
                                {' • ' + formatTimeChat(conversation.lastMessageAt)}
                              </Typography>
                            </span>
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
          <Avatar alt="Remy Sharp" src={user?.avatar} />
          <Typography>{user?.userName}</Typography>
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