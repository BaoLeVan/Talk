import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  CircularProgress,
  Typography,
  IconButton,
  ListItemButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import { searchUsers } from '~/apis';
import useDebounce from '~/hooks/useDebounce';
import ProfileModal from './ProfileModal';
import { useStomp } from '~/components/context/StompContext';
import { useUser } from '../context/UserContext';
import { useFriendStore } from '~/store/useFriendStore';
import { COLORS } from '~/utils/common';

export default function UserSearchDialog({ open, onClose }) {
  const [keyword, setKeyword] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const debouncedKeyword = useDebounce(keyword, 600);
  const { sendMessage } = useStomp();
  const { user: currentUser } = useUser();
  const { sendFriendRequestAction } = useFriendStore();

  useEffect(() => {
    if (debouncedKeyword.trim()) {
      setLoading(true);
      searchUsers(debouncedKeyword)
        .then((response) => {
          const usersList = response?.data || [];
          const filtered = usersList.filter((u) => u.id !== currentUser?.id);
          setUsers(filtered);
        })
        .catch((err) => {
          console.error('Search users failed', err);
          setUsers([]);
        })
        .finally(() => setLoading(false));
    } else {
      setUsers([]);
    }
  }, [debouncedKeyword, currentUser?.id]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setProfileOpen(false);
    setSelectedUser(null);
  };

  const handleSendFriendRequest = (receiverId) => {
    sendFriendRequestAction(sendMessage)(receiverId, '');
    handleCloseProfile();
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(15, 23, 42, 0.16)' } }}
      >
        <DialogTitle sx={{ px: 3, pt: 3, pb: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5 }}>
            <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '16px', bgcolor: COLORS.primaryLight, color: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PersonSearchRoundedIcon />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '18px', color: COLORS.text }}>Search users</Typography>
                <Typography sx={{ fontSize: '13px', color: COLORS.textMuted }}>Find people to connect and chat with</Typography>
              </Box>
            </Box>
            <IconButton onClick={onClose} size="small" sx={{ color: COLORS.textSecondary }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by username or email"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: COLORS.textMuted }} />
                </InputAdornment>
              ),
              sx: {
                height: 52,
                borderRadius: '18px',
                bgcolor: '#F5F6FA',
                '& fieldset': { border: 'none' },
                '&.Mui-focused': { bgcolor: COLORS.white, boxShadow: `0 0 0 2px ${COLORS.primary}22` }
              }
            }}
            sx={{ mb: 2 }}
          />

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress size={30} sx={{ color: COLORS.primary }} />
            </Box>
          )}

          {!loading && users.length === 0 && debouncedKeyword && (
            <Typography sx={{ textAlign: 'center', py: 4, fontSize: '14px', color: COLORS.textMuted }}>
              No users found.
            </Typography>
          )}

          {!loading && !debouncedKeyword && (
            <Box sx={{ p: 3, textAlign: 'center', borderRadius: '20px', bgcolor: '#F8F9FF' }}>
              <Typography sx={{ fontWeight: 700, color: COLORS.text, mb: 0.5 }}>Start searching</Typography>
              <Typography sx={{ fontSize: '13px', color: COLORS.textMuted }}>Type a username or email to find users.</Typography>
            </Box>
          )}

          <List sx={{ maxHeight: 420, overflowY: 'auto', p: 0, scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
            {users.map((user) => (
              <ListItem key={user.id} disablePadding sx={{ mb: 0.75 }}>
                <ListItemButton onClick={() => handleUserClick(user)} sx={{ borderRadius: '18px', px: 1.25, py: 1.1, '&:hover': { bgcolor: COLORS.primaryHover } }}>
                  <ListItemAvatar>
                    <Avatar src={user.avatar} alt={user.userName} sx={{ width: 44, height: 44, boxShadow: '0 8px 18px rgba(0,0,0,0.08)' }}>
                      {user.userName?.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 800, color: COLORS.text, fontSize: '15px' }}>{user.userName}</Typography>}
                    secondary={<Typography sx={{ color: COLORS.textMuted, fontSize: '13px' }}>{user.email}</Typography>}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      <ProfileModal
        open={profileOpen}
        onClose={handleCloseProfile}
        user={selectedUser}
        showAddFriendButton={true}
        onSendFriendRequest={handleSendFriendRequest}
        currentUserId={currentUser?.id}
      />
    </>
  );
}
