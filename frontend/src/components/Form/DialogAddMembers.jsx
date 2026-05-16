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
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { searchUsers } from '~/apis';
import { CheckCircle, CircleOutlined, Close, PersonAddAlt1, Search } from '@mui/icons-material';
import { COLORS } from '~/utils/common';

function DialogAddMembers({ openDialog, setOpenDialog, members = [], onAdd }) {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const memberIds = useMemo(() => new Set(members.map((member) => member.userId)), [members]);

  useEffect(() => {
    if (!openDialog) {
      setKeyword('');
      setSearchResults([]);
      setSelectedUsers([]);
    }
  }, [openDialog]);

  useEffect(() => {
    if (!openDialog) return;

    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      const result = await searchUsers(trimmedKeyword);
      setSearchResults(result?.data || []);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [keyword, openDialog]);

  const toggleSelectedUser = (user) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((selected) => selected.id === user.id);
      if (exists) {
        return prev.filter((selected) => selected.id !== user.id);
      }
      return [...prev, user];
    });
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleAdd = () => {
    if (selectedUsers.length === 0) return;
    onAdd(selectedUsers);
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden' } }}>
      <DialogTitle sx={{ px: 3, pt: 3, pb: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: '16px', bgcolor: COLORS.primaryLight, color: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PersonAddAlt1 />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '18px', color: COLORS.text }}>Add members</Typography>
              <Typography sx={{ fontSize: '13px', color: COLORS.textMuted }}>Search and add new people to this group</Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: COLORS.textSecondary }}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 2 }}>
        <TextField
          fullWidth
          autoFocus
          placeholder="Search by username or email"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 18, color: COLORS.textMuted }} />
              </InputAdornment>
            ),
            sx: {
              height: 50,
              borderRadius: '18px',
              bgcolor: '#F5F6FA',
              '& fieldset': { border: 'none' },
              '&.Mui-focused': { bgcolor: COLORS.white, boxShadow: `0 0 0 2px ${COLORS.primary}22` }
            }
          }}
        />

        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', p: 1.5, borderRadius: '18px', minHeight: 88, alignItems: 'flex-start', bgcolor: '#F8F9FF' }}>
          {selectedUsers.length === 0 && (
            <Typography sx={{ px: 1, py: 1.5, width: '100%', textAlign: 'center', color: COLORS.textMuted, fontSize: '13px' }}>
              No users selected.
            </Typography>
          )}
          {selectedUsers.map((user) => (
            <Box key={user.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 1, py: 0.75, borderRadius: '999px', bgcolor: COLORS.white, border: '1px solid #EEF2FF' }}>
              <Avatar src={user.avatar} alt={user.userName} sx={{ width: 28, height: 28 }} />
              <Typography sx={{ maxWidth: 120, fontSize: '13px', fontWeight: 700, color: COLORS.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.userName}
              </Typography>
              <IconButton size="small" onClick={() => toggleSelectedUser(user)} sx={{ p: 0.25, color: COLORS.textSecondary }}>
                <Close sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          ))}
        </Box>

        <List sx={{ mt: 1.5, maxHeight: 320, overflowY: 'auto', p: 0, scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
          {searchResults.length === 0 && keyword.trim() !== '' && (
            <Typography sx={{ width: '100%', textAlign: 'center', py: 3, color: COLORS.textMuted, fontSize: '13px' }}>
              No users found.
            </Typography>
          )}

          {searchResults
            .filter((resultUser) => !memberIds.has(resultUser.id))
            .map((resultUser) => {
              const checked = selectedUsers.some((user) => user.id === resultUser.id);
              return (
                <ListItemButton key={resultUser.id} onClick={() => toggleSelectedUser(resultUser)} sx={{ mb: 0.75, borderRadius: '18px', '&:hover': { bgcolor: COLORS.primaryHover } }}>
                  <ListItemAvatar>
                    <Avatar src={resultUser.avatar} alt={resultUser.userName} sx={{ width: 42, height: 42 }} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 800, fontSize: '15px', color: COLORS.text }}>{resultUser.userName}</Typography>}
                    secondary={<Typography sx={{ fontSize: '13px', color: COLORS.textMuted }}>{resultUser.email}</Typography>}
                  />
                  <Checkbox icon={<CircleOutlined />} checkedIcon={<CheckCircle />} checked={checked} sx={{ color: COLORS.textMuted, '&.Mui-checked': { color: COLORS.primary } }} />
                </ListItemButton>
              );
            })}
        </List>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: '999px', textTransform: 'none', py: 1, px: 2.5, fontWeight: 700, borderColor: COLORS.border, color: COLORS.textSecondary }}>
          Cancel
        </Button>
        <Button onClick={handleAdd} disabled={selectedUsers.length === 0} variant="contained" sx={{ borderRadius: '999px', textTransform: 'none', py: 1, px: 2.5, fontWeight: 700, boxShadow: 'none', background: 'linear-gradient(135deg, #6EA8FE 0%, #5B67FF 55%, #7C5CFF 100%)' }}>
          Add members
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogAddMembers;
