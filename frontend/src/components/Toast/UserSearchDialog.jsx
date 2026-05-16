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
import { searchUsers } from '~/apis';
import useDebounce from '~/hooks/useDebounce';
import ProfileModal from './ProfileModal';
import { useStomp } from '~/components/context/StompContext';
import { useUser } from '../context/UserContext';
import { useFriendStore } from '~/store/useFriendStore';

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
          // response structure: { code, message, data: UserResponse[] }
          const usersList = response?.data || [];
          // Filter out current user
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
    // Optionally close profile and dialog after sending
    handleCloseProfile();
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Tìm kiếm người dùng
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Nhập tên người dùng..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          )}
          {!loading && users.length === 0 && debouncedKeyword && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              Không tìm thấy người dùng.
            </Typography>
          )}
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {users.map((user) => (
              <ListItem
                key={user.id}
                disablePadding
                sx={{ borderRadius: 2, mb: 0.5 }}
              >
                <ListItemButton onClick={() => handleUserClick(user)}>
                  <ListItemAvatar>
                    <Avatar src={user.avatar} alt={user.userName}>
                      {user.userName?.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.userName}
                    secondary={user.email}
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
