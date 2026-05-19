import { Avatar, Badge, Box, CircularProgress, Collapse, Dialog, IconButton, InputAdornment, List, ListItemButton, Paper, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { KeyboardArrowDown, KeyboardArrowRight, LogoutOutlined, Search, People } from '@mui/icons-material';
import { COLORS, formatTimeChat } from '~/utils/common';
import { useNavigate } from 'react-router';
import { changePassword, createGroupConversation, logout, setAccessToken } from '~/apis';
import { toast } from 'react-toastify';
import { useUser } from '~/components/context/UserContext';
import { TYPE } from '~/utils/constants';
import FriendsList from './FriendsList';
import NotificationsList from './Toast/NotificationsList';
import ProfileModal from './Toast/ProfileModal';
import { useChatStore } from '~/store/useChatStore';
import CreateGroupConversationDialog from './Form/CreateGroupConversationDialog';
import DialogConfirm from './Form/DialogConfirm';
import ChangePasswordDialog from './Form/ChangePasswordDialog';

function SideBar({ selectedIndex, onSelectConversation, setConversation, searchConversation, setSearchConversation }) {
  const navigate = useNavigate();
  const [friendsDialogOpen, setFriendsDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { user, setUser } = useUser();
  const [collapsedSections, setCollapsedSections] = useState({ private: false, group: false });
  const { conversations, isLoading, fetchConversations } = useChatStore();

  const privateConversations = conversations?.filter((conversation) => conversation.conversationType === TYPE.PRIVATE) || [];
  const groupConversations = conversations?.filter((conversation) => conversation.conversationType === TYPE.GROUP) || [];

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const confirmLogout = async () => {
    setAccessToken(null);
    const result = await logout();
    if (result?.message) toast.success(result.message);
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  }

  const handleChangePassword = async ({ currentPassword, newPassword }, resetForm) => {
    try {
      setIsChangingPassword(true);
      const result = await changePassword({ currentPassword, newPassword });
      if (result?.message) toast.success(result.message);
      resetForm();
      setChangePasswordDialogOpen(false);
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setAccessToken(null);
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    } finally {
      setIsChangingPassword(false);
    }
  }

  const handleCreateGroupConversation = async (payload) => {
    const result = await createGroupConversation(payload);
    const createdConversation = result?.data;

    if (user?.id) {
      await fetchConversations(user.id, searchConversation || '');
    }

    if (createdConversation?.conversationId) {
      onSelectConversation(createdConversation.conversationId);
      setConversation(createdConversation);
      setCollapsedSections((prev) => ({ ...prev, group: false }));
      toast.success(result?.message || 'Tạo nhóm thành công');
    }

    setCreateGroupDialogOpen(false);
  };

  const handleListItemClick = (event, index) => {
    onSelectConversation(index);
    const result = conversations.find((data) => data.conversationId === index);
    setConversation(result);
  };

  const renderConversationItem = (conversation) => {
    const isSelected = selectedIndex === conversation.conversationId;
    const hasUnread = conversation.conversationUnreadCount > 0;
    const displayName = conversation.conversationType === TYPE.GROUP ? conversation.conversationTitle : conversation.userName;
    const avatarSrc = conversation.conversationType === TYPE.GROUP ? conversation.conversationAvatar : conversation.userAvatar;

    return (
      <ListItemButton key={conversation.conversationId} selected={isSelected} onClick={(e) => handleListItemClick(e, conversation.conversationId)} sx={{ px: 2, py: 1.5, mx: 1.5, my: 0.5, borderRadius: '24px', minHeight: '90px', alignItems: 'center', transition: 'all 0.2s ease', bgcolor: isSelected ? COLORS.primaryLight : 'transparent', '&:hover': { bgcolor: isSelected ? COLORS.primaryLight : '#F8F9FF', transform: 'scale(1.01)' }, '&.Mui-selected': { bgcolor: COLORS.primaryLight }, '&.Mui-selected:hover': { bgcolor: COLORS.primaryLight } }}>
        <Box sx={{ mr: 2, flexShrink: 0 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar alt={displayName} src={avatarSrc} sx={{ width: 56, height: 56, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
            {(conversation?.userIsOnline || conversation?.conversationType === TYPE.GROUP) && (
              <Box sx={{
                position: 'absolute',
                bottom: 1,
                right: 1,
                width: 12,
                height: 12,
                borderRadius: '999px',
                bgcolor: COLORS.online,
                border: '2px solid white'
              }} />
            )}
          </Box>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography sx={{ fontWeight: hasUnread ? 700 : 600, fontSize: '18px', color: isSelected ? COLORS.primary : COLORS.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>{displayName}</Typography>
            <Typography sx={{ fontSize: '13px', color: COLORS.textMuted, flexShrink: 0 }}>{formatTimeChat(conversation.conversationLastMessageAt)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '14px', color: hasUnread ? COLORS.text : COLORS.textSecondary, fontWeight: hasUnread ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
              {conversation.conversationLastSenderId === user?.id ? `Bạn: ${conversation?.conversationLastMessage || 'Đã gửi file'}` : conversation?.conversationLastSenderName === null ? "" : (conversation?.conversationLastSenderName + ': ' + (conversation?.conversationLastMessage || 'Đã gửi file'))}
            </Typography>
            {hasUnread && <Badge badgeContent={conversation.conversationUnreadCount} sx={{ '& .MuiBadge-badge': { fontSize: '11px', height: '20px', minWidth: '20px', fontWeight: 700, bgcolor: COLORS.primary, color: COLORS.white, borderRadius: '999px' } }} />}
          </Box>
        </Box>
      </ListItemButton>
    );
  };

  const renderConversationSection = (sectionKey, title, items) => {
    const isCollapsed = collapsedSections[sectionKey];

    return (
      <Box sx={{ mb: 1 }}>
        <Box onClick={() => toggleSection(sectionKey)} sx={{ mx: 1.5, px: 1.5, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '16px', cursor: 'pointer', color: COLORS.textSecondary, '&:hover': { bgcolor: COLORS.primaryHover, color: COLORS.primary } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            {isCollapsed ? <KeyboardArrowRight fontSize='small' /> : <KeyboardArrowDown fontSize='small' />}
            <Typography sx={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</Typography>
          </Box>
          <Typography sx={{ fontSize: '12px', fontWeight: 700, color: COLORS.textMuted }}>{items.length}</Typography>
        </Box>
        <Collapse in={!isCollapsed} timeout='auto' unmountOnExit>
          {items.length > 0 ? items.map(renderConversationItem) : <Typography sx={{ px: 3, py: 1.5, color: COLORS.textMuted, fontSize: '13px' }}>Không có cuộc trò chuyện</Typography>}
        </Collapse>
      </Box>
    );
  };

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
              onClick={() => setCreateGroupDialogOpen(true)}
              sx={{ borderRadius: '12px', color: COLORS.textSecondary, '&:hover': { bgcolor: COLORS.primaryHover, color: COLORS.primary } }}
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

      {/* Conversation list */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <List
          sx={{
            width: '100%',
            height: '100%',
            p: 0,
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress size={28} sx={{ color: COLORS.primary }} />
            </Box>
          ) : (
            <>
              {renderConversationSection('private', 'Private', privateConversations)}
              {renderConversationSection('group', 'Group', groupConversations)}
            </>
          )}
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
            {user?.isOnline && (
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
            )}
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '15px', color: COLORS.text, lineHeight: 1.2 }}>
              {user?.userName}
            </Typography>
            {user?.isOnline && <Typography sx={{ fontSize: '12px', color: COLORS.online, fontWeight: 500 }}>Trực tuyến</Typography>}
          </Box>
        </Box>
        <IconButton
          size='small'
          onClick={() => setLogoutDialogOpen(true)}
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
      <ProfileModal
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        user={user}
        showChangePasswordButton
        onOpenChangePassword={() => {
          setProfileDialogOpen(false);
          setChangePasswordDialogOpen(true);
        }}
      />
      <CreateGroupConversationDialog
        open={createGroupDialogOpen}
        onClose={() => setCreateGroupDialogOpen(false)}
        onCreate={handleCreateGroupConversation}
      />
      <ChangePasswordDialog
        open={changePasswordDialogOpen}
        onClose={() => {
          setChangePasswordDialogOpen(false);
          setShowCurrentPassword(false);
          setShowNewPassword(false);
        }}
        onSubmit={handleChangePassword}
        isSubmitting={isChangingPassword}
        showCurrentPassword={showCurrentPassword}
        setShowCurrentPassword={setShowCurrentPassword}
        showNewPassword={showNewPassword}
        setShowNewPassword={setShowNewPassword}
      />
      <DialogConfirm
        openDialog={logoutDialogOpen}
        setOpenDialog={setLogoutDialogOpen}
        title='Logout'
        description='Ban co chac muon dang xuat khong?'
        handleFunction={confirmLogout}
      />
    </Paper>
  )
}

export default SideBar
