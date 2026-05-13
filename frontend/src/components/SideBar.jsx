import { Avatar, Badge, Box, CircularProgress, Dialog, FormControl, IconButton, InputAdornment, List, ListItemButton, Paper, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { LogoutOutlined, Search, People } from '@mui/icons-material';
import { formatTimeChat } from '~/utils/common';
import { useNavigate } from 'react-router';
import { getAllConversationsByUser, logout, setAccessToken } from '~/apis';
import { toast } from 'react-toastify';
import { useUser } from '~/components/context/UserContext';
import useDebounce from '../hooks/useDebounce';
import { TYPE } from '~/utils/constants';
import FriendsList from './FriendsList';
import NotificationsList from './NotificationsList';
import ProfileModal from './ProfileModal';
import UserSearchDialog from './UserSearchDialog';
import { useChatStore } from '~/store/useChatStore';

const COLORS = {
  primary: '#5B67FF',
  primaryLight: '#EEF2FF',
  primaryHover: '#F1F3FF',
  bg: '#F8F9FC',
  white: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#94A3B8',
  unreadBadge: '#FF5C8A',
  online: '#22C55E',
  border: '#EEF2FF',
}

function SideBar({ selectedIndex, onSelectConversation, setConversation }) {
  const navigate = useNavigate();
  const [friendsDialogOpen, setFriendsDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [userSearchDialogOpen, setUserSearchDialogOpen] = useState(false);
  const [searchConversation, setSearchConversation] = useState('');
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState(0);
  const { conversations, fetchConversations, isLoading } = useChatStore();
  const debouncedValue = useDebounce(searchConversation, 500);

  useEffect(() => {
    if (user) fetchConversations(user.id, debouncedValue);
  }, [user, debouncedValue]);

  const handleLogout = async () => {
    setAccessToken(null);
    const result = await logout();
    if (result?.message) toast.success(result.message);
    localStorage.removeItem('user');
    navigate('/login');
  }

  const handleListItemClick = (event, index) => {
    onSelectConversation(index);
    const result = conversations.find((data) => data.conversationId === index);
    setConversation(result);
  };

  const tabs = ['Tất cả', 'Chưa đọc', 'Yêu thích', 'Nhóm'];

  return (
    <Paper elevation={0} sx={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 0,
      bgcolor: COLORS.bg,
      overflow: 'hidden',
    }}>
      {/* Header: Logo + actions */}
      <Box sx={{ px: 3, pt: 3, pb: 2, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Typography sx={{
            fontWeight: 700,
            fontSize: '22px',
            background: 'linear-gradient(135deg, #5B67FF 0%, #7C5CFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}>
            Talker
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <NotificationsList />
            <IconButton
              size='small'
              onClick={() => setFriendsDialogOpen(true)}
              sx={{ borderRadius: '12px', color: COLORS.textSecondary, '&:hover': { bgcolor: COLORS.primaryHover, color: COLORS.primary } }}
            >
              <People fontSize='small' />
            </IconButton>
            <IconButton
              size='small'
              onClick={() => setUserSearchDialogOpen(true)}
              sx={{ borderRadius: '12px', bgcolor: COLORS.primaryLight, color: COLORS.primary, '&:hover': { bgcolor: '#E0E7FF' } }}
            >
              <AddCircleOutlineIcon fontSize='small' />
            </IconButton>
          </Box>
        </Box>

        {/* Search bar */}
        <TextField
          fullWidth
          placeholder='Tìm kiếm'
          value={searchConversation}
          onChange={(e) => setSearchConversation(e.target.value)}
          size='small'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Search sx={{ fontSize: 18, color: COLORS.textMuted }} />
              </InputAdornment>
            ),
            sx: {
              height: '52px',
              borderRadius: '18px',
              bgcolor: '#F5F6FA',
              fontSize: '15px',
              '& fieldset': { border: 'none' },
              '&:hover': { bgcolor: '#EDEEF5' },
              '&.Mui-focused': { bgcolor: COLORS.white, boxShadow: `0 0 0 2px ${COLORS.primary}22` },
            }
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '18px' } }}
        />
      </Box>

      {/* Filter tabs */}
      <Box sx={{ px: 3, pb: 1.5, display: 'flex', gap: 1, flexShrink: 0 }}>
        {tabs.map((tab, idx) => (
          <Box
            key={idx}
            onClick={() => setActiveTab(idx)}
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: activeTab === idx ? 600 : 400,
              color: activeTab === idx ? COLORS.primary : COLORS.textSecondary,
              bgcolor: activeTab === idx ? COLORS.primaryLight : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              '&:hover': { bgcolor: COLORS.primaryHover, color: COLORS.primary }
            }}
          >
            {tab}
          </Box>
        ))}
      </Box>

      {/* Conversation list */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <List sx={{ width: '100%', height: '100%', p: 0, overflow: 'auto' }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress size={28} sx={{ color: COLORS.primary }} />
            </Box>
          ) : conversations?.map((conversation) => {
            const isSelected = selectedIndex === conversation.conversationId;
            const hasUnread = conversation.unreadCount > 0;
            const displayName = conversation.conversationType === TYPE.GROUP
              ? conversation.conversationTitle
              : conversation.userName;
            const avatarSrc = conversation.conversationType === TYPE.GROUP
              ? conversation.conversationAvatar
              : conversation.userAvatar;

            return (
              <ListItemButton
                key={conversation.conversationId}
                selected={isSelected}
                onClick={(e) => handleListItemClick(e, conversation.conversationId)}
                sx={{
                  px: 2,
                  py: 1.5,
                  mx: 1.5,
                  my: 0.5,
                  borderRadius: '24px',
                  minHeight: '90px',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                  bgcolor: isSelected ? COLORS.primaryLight : 'transparent',
                  '&:hover': {
                    bgcolor: isSelected ? COLORS.primaryLight : '#F8F9FF',
                    transform: 'scale(1.01)',
                  },
                  '&.Mui-selected': { bgcolor: COLORS.primaryLight },
                  '&.Mui-selected:hover': { bgcolor: COLORS.primaryLight },
                }}
              >
                {/* Avatar with online dot */}
                <Box sx={{ mr: 2, flexShrink: 0 }}>
                  <Badge anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" color="success">
                    <Avatar
                      alt={displayName}
                      src={avatarSrc}
                      sx={{ width: 56, height: 56, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                    />
                  </Badge>
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography sx={{
                      fontWeight: hasUnread ? 700 : 600,
                      fontSize: '18px',
                      color: isSelected ? COLORS.primary : COLORS.text,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '65%'
                    }}>
                      {displayName}
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: COLORS.textMuted, flexShrink: 0 }}>
                      {formatTimeChat(conversation.conversationLastMessageAt)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{
                      fontSize: '14px',
                      color: hasUnread ? COLORS.text : COLORS.textSecondary,
                      fontWeight: hasUnread ? 600 : 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '80%'
                    }}>
                      {conversation.userID === user?.id
                        ? `Bạn: ${conversation.conversationLastMessage}`
                        : conversation.conversationLastMessage}
                    </Typography>
                    {hasUnread && (
                      <Badge
                        badgeContent={conversation.unreadCount}
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: '11px',
                            height: '20px',
                            minWidth: '20px',
                            fontWeight: 700,
                            bgcolor: COLORS.unreadBadge,
                            color: COLORS.white,
                            borderRadius: '999px',
                          }
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* User profile bottom */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2.5,
        py: 2,
        borderTop: `1px solid ${COLORS.border}`,
        flexShrink: 0,
        bgcolor: COLORS.white,
      }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            borderRadius: '16px',
            px: 1.5,
            py: 1,
            transition: 'all 0.2s ease',
            '&:hover': { bgcolor: COLORS.primaryHover }
          }}
          onClick={() => setProfileDialogOpen(true)}
        >
          <Box sx={{ position: 'relative' }}>
            <Avatar alt={user?.userName} src={user?.avatar} sx={{ width: 40, height: 40 }} />
            <Box sx={{
              position: 'absolute',
              bottom: 1,
              right: 1,
              width: 10,
              height: 10,
              borderRadius: '999px',
              bgcolor: COLORS.online,
              border: '2px solid white'
            }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '15px', color: COLORS.text, lineHeight: 1.2 }}>
              {user?.userName}
            </Typography>
            <Typography sx={{ fontSize: '12px', color: COLORS.online, fontWeight: 500 }}>Trực tuyến</Typography>
          </Box>
        </Box>
        <IconButton
          size='small'
          onClick={handleLogout}
          sx={{
            borderRadius: '12px',
            color: COLORS.textSecondary,
            '&:hover': { color: '#EF4444', bgcolor: '#FEF2F2' }
          }}
        >
          <LogoutOutlined fontSize='small' />
        </IconButton>
      </Box>

      <Dialog open={friendsDialogOpen} onClose={() => setFriendsDialogOpen(false)} fullWidth>
        <FriendsList />
      </Dialog>
      <ProfileModal open={profileDialogOpen} onClose={() => setProfileDialogOpen(false)} user={user} />
      <UserSearchDialog open={userSearchDialogOpen} onClose={() => setUserSearchDialogOpen(false)} />
    </Paper>
  )
}

export default SideBar
