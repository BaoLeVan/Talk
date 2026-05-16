import React, { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { CheckCircle, CircleOutlined, Close, GroupAdd, Search } from '@mui/icons-material';
import { useFriendStore } from '~/store/useFriendStore';
import { COLORS } from '~/utils/common';

function CreateGroupConversationDialog({ open, onClose, onCreate }) {
  const { friends, fetchFriends, loading } = useFriendStore();
  const [title, setTitle] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) fetchFriends();
  }, [open, fetchFriends]);

  useEffect(() => {
    if (!open) {
      setTitle('');
      setKeyword('');
      setSelectedUsers([]);
      setSubmitting(false);
    }
  }, [open]);

  const filteredFriends = useMemo(() => {
    const trimmedKeyword = keyword.trim().toLowerCase();
    if (!trimmedKeyword) return friends;
    return friends.filter((friend) =>
      friend.userName?.toLowerCase().includes(trimmedKeyword) ||
      friend.email?.toLowerCase().includes(trimmedKeyword)
    );
  }, [friends, keyword]);

  const toggleSelectedUser = (friend) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((selected) => selected.id === friend.id);
      if (exists) return prev.filter((selected) => selected.id !== friend.id);
      return [...prev, friend];
    });
  };

  const handleCreate = async () => {
    if (!title.trim() || selectedUsers.length === 0 || submitting) return;
    setSubmitting(true);
    try {
      await onCreate({
        title: title.trim(),
        memberIds: selectedUsers.map((user) => user.id),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '24px' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box sx={{ width: 42, height: 42, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: COLORS.primaryLight, color: COLORS.primary }}>
            <GroupAdd />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '18px' }}>Create group</Typography>
            <Typography sx={{ fontSize: '13px', color: COLORS.textMuted }}>Create a new group conversation and add members</Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small"><Close fontSize="small" /></IconButton>
      </DialogTitle>
      <DialogContent style={{ paddingTop: '10px' }}>
        <TextField
          fullWidth
          label="Group name"
          placeholder="Enter group name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{ sx: { borderRadius: '16px' } }}
        />
        <TextField
          fullWidth
          placeholder="Search friends to add"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 18, color: COLORS.textMuted }} />
              </InputAdornment>
            ),
            sx: { borderRadius: '16px' }
          }}
        />

        <Box sx={{ mt: 2, mb: 2, minHeight: 74, p: 1.5, borderRadius: '18px', bgcolor: '#F8F9FF', display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {selectedUsers.length === 0 ? (
            <Typography sx={{ color: COLORS.textMuted, fontSize: '13px' }}>Select at least one friend to create group.</Typography>
          ) : selectedUsers.map((user) => (
            <Box key={user.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 1, py: 0.75, borderRadius: '999px', bgcolor: '#FFFFFF', border: '1px solid #EEF2FF' }}>
              <Avatar src={user.avatar} alt={user.userName} sx={{ width: 26, height: 26 }} />
              <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{user.userName}</Typography>
              <IconButton size="small" onClick={() => toggleSelectedUser(user)} sx={{ p: 0.25 }}>
                <Close sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          ))}
        </Box>

        <List sx={{ maxHeight: 320, overflowY: 'auto', p: 0, scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
          {loading ? (
            <Typography sx={{ textAlign: 'center', py: 3, color: COLORS.textMuted }}>Loading friends...</Typography>
          ) : filteredFriends.length === 0 ? (
            <Typography sx={{ textAlign: 'center', py: 3, color: COLORS.textMuted }}>No friends found.</Typography>
          ) : filteredFriends.map((friend) => {
            const checked = selectedUsers.some((selected) => selected.id === friend.id);
            return (
              <ListItemButton key={friend.id} onClick={() => toggleSelectedUser(friend)} sx={{ mb: 0.75, borderRadius: '18px' }}>
                <ListItemAvatar>
                  <Avatar src={friend.avatar} alt={friend.userName} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography sx={{ fontWeight: 700, fontSize: '15px' }}>{friend.userName}</Typography>}
                  secondary={<Typography sx={{ fontSize: '13px', color: COLORS.textMuted }}>{friend.email}</Typography>}
                />
                <Checkbox checked={checked} icon={<CircleOutlined />} checkedIcon={<CheckCircle />} />
              </ListItemButton>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '999px', textTransform: 'none' }}>Cancel</Button>
        <Button onClick={handleCreate} disabled={!title.trim() || selectedUsers.length === 0 || submitting} variant="contained" sx={{ borderRadius: '999px', textTransform: 'none', background: 'linear-gradient(135deg, #6EA8FE 0%, #5B67FF 55%, #7C5CFF 100%)' }}>
          {submitting ? 'Creating...' : 'Create group'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateGroupConversationDialog;
