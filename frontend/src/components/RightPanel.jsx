import { Avatar, Box, Paper, Typography, List, ListItem, ListItemAvatar, ListItemText, Badge, Switch, Button, IconButton, ListItemButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ShieldIcon from '@mui/icons-material/Shield';
import { styled } from '@mui/material/styles';
import { Close, EmailOutlined } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DialogConfirm from './Form/DialogConfirm';
import DialogAddMembers from './Form/DialogAddMembers';
import { useUser } from './context/UserContext';
import { TYPE } from '~/utils/constants';
import { getListMemberByConversationId } from '~/apis';
import { useChatStore } from '~/store/useChatStore';
import { useStomp } from '~/components/context/StompContext';


function RightPanel({ conversation }) {
    const [userDelete, setUserDelete] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const { user } = useUser();
    const { members, setMembers } = useChatStore();
    const { sendMessage } = useStomp();

    useEffect(() => {
        if (conversation?.conversationType === TYPE.GROUP) {
            const getListMember = async () => {
                const result = await getListMemberByConversationId(conversation?.conversationId);
                if (result) {
                    setMembers(result.data);
                }
            }
            getListMember();
        }
    }, [conversation?.conversationId, conversation?.conversationType, setMembers])

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    }

    const handleDelete = (userDelete) => {
        setOpenDialog(true)
        setUserDelete(userDelete)
    }

    const deleteUser = (userDeleteId, userDeleteName, conversationId) => {
        sendMessage(`/app/chat.deleteUser`, {
            conversationId: conversationId,
            userId: user?.id,
            userTargetIds: [userDeleteId],
            userTargetNames: [userDeleteName]
        })
    }

    const leaveGroup = (conversationId) => {
        sendMessage(`/app/chat.leaveGroup`, {
            conversationId: conversationId,
            userId: user?.id
        })
    }

    const handleAddMembers = (selectedUsers) => {
        const userTargetIds = selectedUsers.map(u => u.id);
        const userTargetNames = selectedUsers.map(u => u.userName);

        sendMessage(`/app/chat.addUser`, {
            conversationId: conversation?.conversationId,
            userId: user?.id,
            userTargetIds: userTargetIds,
            userTargetNames: userTargetNames
        });
    }

    const SwitchCustom = styled((props) => (
        <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
    ))(({ theme }) => ({
        width: 42,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
                transform: 'translateX(16px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    backgroundColor: '#65C466',
                    opacity: 1,
                    border: 0,
                    ...theme.applyStyles('dark', {
                        backgroundColor: '#2ECA45',
                    }),
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: 0.5,
                },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: '#33cf4d',
                border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
                color: theme.palette.grey[100],
                ...theme.applyStyles('dark', {
                    color: theme.palette.grey[600],
                }),
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.7,
                ...theme.applyStyles('dark', {
                    opacity: 0.3,
                }),
            },
        },
        '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
        },
        '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: '#E9E9EA',
            opacity: 1,
            transition: theme.transitions.create(['background-color'], {
                duration: 500,
            }),
            ...theme.applyStyles('dark', {
                backgroundColor: '#39393D',
            }),
        },
    }));

    return (
        <>
            <Paper elevation={0} sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: 0,
                bgcolor: 'background.paper'
            }}>
                <Box sx={{
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                    flexShrink: 0,
                    px: 2.5,
                    py: 2
                }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.primary' }}>Contact Info</Typography>
                </Box>
                {conversation.conversationType === TYPE.GROUP ?
                    <Box sx={{
                        px: 3,
                        py: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                        flexShrink: 0,
                        gap: 1
                    }}>
                        <Avatar src={conversation?.avatar} sx={{ width: 80, height: 80, boxShadow: '0 4px 14px rgba(0,0,0,0.12)' }} />
                        <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: 'text.primary' }}>
                            {conversation?.conversationTitle}
                        </Typography>
                    </Box>
                    : <Box sx={{
                        px: 3,
                        py: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                        flexShrink: 0,
                        gap: 1
                    }}>
                        <Avatar src={conversation?.userAvatar} sx={{ width: 80, height: 80, boxShadow: '0 4px 14px rgba(0,0,0,0.12)' }} />
                        <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: 'text.primary' }}>
                            {conversation?.userName}
                        </Typography>
                    </Box>
                }
                <Box sx={{ borderBottom: '1px solid rgba(0,0,0,0.06)', flexGrow: 1, overflow: 'hidden' }}>
                    {conversation.conversationType === TYPE.GROUP ?
                        <List sx={{ width: '100%', height: '100%', bgcolor: 'background.paper', position: 'relative', overflow: 'auto', p: 0 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2.5, py: 1.5 }}>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.secondary' }}>{members.length} Members</Typography>
                                <IconButton size='small' onClick={() => setOpenAddDialog(true)} sx={{ color: 'primary.main' }}>
                                    <AddCircleIcon fontSize='small' />
                                </IconButton>
                            </Box>
                            {members.map((member) => (
                                <ListItemButton
                                    key={member.userId}
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        mx: 1,
                                        borderRadius: '8px',
                                        '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                                    }}
                                    selected={selectedIndex === member.userId}
                                    onClick={(event) => handleListItemClick(event, member.userId)}
                                >
                                    <ListItem alignItems="flex-start" sx={{ p: 0 }}>
                                        <ListItemAvatar>
                                            <Badge anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" color="success">
                                                <Avatar alt={member.userName} src={member.userAvatar} sx={{ width: 36, height: 36 }} />
                                            </Badge>
                                        </ListItemAvatar>
                                        <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{member.userName}</Typography>} />
                                        {user?.id !== member?.userId && member?.userRole !== 'ADMIN' && (
                                            <IconButton onClick={e => handleDelete(member)} size='small' color='error'>
                                                <Close fontSize="small" />
                                            </IconButton>
                                        )}
                                    </ListItem>
                                </ListItemButton>
                            ))}
                        </List> :
                        <Box sx={{ display: 'flex', flexDirection: 'column', px: 2.5, py: 2, gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ bgcolor: '#f0f4ff', p: 1, borderRadius: '10px' }}>
                                    <EmailOutlined sx={{ color: 'primary.main', fontSize: 20 }} />
                                </Box>
                                <Box>
                                    <Typography fontSize={12} color="text.secondary" sx={{ fontWeight: 500 }}>Email</Typography>
                                    <Typography fontSize={13} variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>{user.email}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    }
                </Box>
                <Box sx={{ borderBottom: '1px solid rgba(0,0,0,0.06)', flexShrink: 0, px: 2.5, py: 1.5 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.secondary', mb: 1 }}>Settings</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <NotificationsNoneIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>Notifications</Typography>
                        </Box>
                        <SwitchCustom />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ShieldIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>Block User</Typography>
                        </Box>
                        <SwitchCustom />
                    </Box>
                </Box>
                {conversation.conversationType === TYPE.GROUP ? (
                    <Box sx={{ display: 'flex', px: 2, py: 2, gap: 1, flexShrink: 0 }}>
                        <Button fullWidth variant="outlined" color='error'
                            sx={{ borderRadius: '10px', fontWeight: 600, textTransform: 'none' }}
                            onClick={() => leaveGroup(conversation?.conversationId)}>
                            Leave Group
                        </Button>
                        <Button fullWidth variant="outlined" color='error'
                            sx={{ borderRadius: '10px', fontWeight: 600, textTransform: 'none' }}>
                            Delete Group
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ px: 2, py: 2, flexShrink: 0 }}>
                        <Button fullWidth variant="outlined" color='error'
                            sx={{ borderRadius: '10px', fontWeight: 600, textTransform: 'none' }}>
                            Delete Chat
                        </Button>
                    </Box>
                )}
            </Paper>
            <DialogConfirm
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                title={`Delete User ${userDelete?.userName}`}
                description={`Are you sure you want to delete ${userDelete?.userName}?`}
                handleFunction={() => deleteUser(userDelete?.userId, userDelete?.userName, conversation?.conversationId)}
            />
            <DialogAddMembers
                openDialog={openAddDialog}
                setOpenDialog={setOpenAddDialog}
                members={members}
                onAdd={handleAddMembers}
            />
        </>
    )
}

export default RightPanel