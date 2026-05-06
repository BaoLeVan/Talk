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
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    TextField,
    Typography,
} from '@mui/material';
import { searchUsers } from '~/apis';
import { CheckCircle, CircleOutlined, Close } from '@mui/icons-material';

function DialogAddMembers({ openDialog, setOpenDialog, members = [], onAdd }) {
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const memberIds = useMemo(() => new Set(members.map(member => member.userId)), [members]);

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
        setSelectedUsers(prev => {
            const exists = prev.some(selected => selected.id === user.id);
            if (exists) {
                return prev.filter(selected => selected.id !== user.id);
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
        <Dialog
            open={openDialog}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>Add People</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    autoFocus
                    label="Search"
                    margin="normal"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                />
                <Box sx={{
                    display: 'flex',
                    gap: 1.5,
                    flexWrap: 'wrap',
                    p: 1.5,
                    borderRadius: 2,
                    minHeight: 92,
                    alignItems: 'flex-start',
                }}>
                    {selectedUsers.length === 0 && (
                        <Typography variant="body2" color="text.secondary" sx={{ px: 1, py: 2, width: '100%', textAlign: 'center' }}>
                            No users selected.
                        </Typography>
                    )}
                    {selectedUsers.map((user) => (
                        <Box key={user.id} sx={{
                            width: 72,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 0.5,
                        }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={user.avatar}
                                    alt={user.userName}
                                    sx={{ width: 50, height: 50 }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={() => toggleSelectedUser(user)}
                                    sx={{
                                        position: 'absolute',
                                        top: -6,
                                        right: -6,
                                        width: 20,
                                        height: 20,
                                        bgcolor: 'grey.700',
                                        color: 'common.white',
                                        boxShadow: 1,
                                        '&:hover': {
                                            bgcolor: 'grey.900',
                                        },
                                    }}
                                >
                                    <Close sx={{ fontSize: 14 }} />
                                </IconButton>
                            </Box>
                            <Typography
                                variant="caption"
                                title={user.userName}
                                sx={{
                                    maxWidth: '100%',
                                    textAlign: 'center',
                                    color: 'text.primary',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {user.userName}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <List sx={{ mt: 1, maxHeight: 320, overflowY: 'auto' }}>
                    {(searchResults.length === 0 && keyword.trim() !== '') && (
                        <Typography variant="body2" color="text.secondary" sx={{ width: '100%', textAlign: 'center' }}>
                            No users found.
                        </Typography>
                    )}
                    {searchResults.filter(resultUser => !memberIds.has(resultUser.id))
                        .map((resultUser) => {
                            const checked = selectedUsers.some(user => user.id === resultUser.id);
                            return (
                                <ListItem key={resultUser.id} disablePadding>
                                    <ListItemButton onClick={() => toggleSelectedUser(resultUser)}>
                                        <ListItemAvatar>
                                            <Avatar src={resultUser.avatar} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={resultUser.userName}
                                            secondary={resultUser.email}
                                        />
                                        <Checkbox
                                            icon={<CircleOutlined />}
                                            checkedIcon={<CheckCircle />}
                                            checked={checked} />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleAdd} disabled={selectedUsers.length === 0}>Add</Button>
            </DialogActions>
        </Dialog>
    );
}

export default DialogAddMembers;
