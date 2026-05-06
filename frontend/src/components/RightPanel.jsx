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
import { useChatStore } from './store/useChatStore';
import { useStomp } from '~/hooks/useStomp';


function RightPanel({ conversation }) {
    const [userDelete, setUserDelete] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const { user } = useUser();
    const { members, setMembers } = useChatStore();
    const { connected, subscribeRoom, sendMessage } = useStomp();

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

    const deleteMember = (userDeleteId, userDeleteName, conversationId) => {
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
            <Paper sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <Box sx={{
                    borderBottom: '1px solid #e0e0e0', flexShrink: 0,
                    overflow: 'hidden'
                }}>
                    <Typography sx={{
                        p: 2,
                        fontWeight: '600',
                        fontSize: '1.25rem'
                    }}>Contact Info</Typography>
                </Box>
                {conversation.conversationType === TYPE.GROUP ?
                    <Box sx={{
                        px: '20px',
                        py: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderBottom: '1px solid #e0e0e0',
                        flexShrink: 0,
                        overflow: 'hidden'
                    }}>
                        <Avatar
                            src={conversation?.avatar}
                            sx={{
                                width: '96px',
                                height: '96px',
                                marginBottom: 2
                            }} />
                        <Typography sx={{
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            marginBottom: 0.5
                        }}>{conversation?.conversationTitle}</Typography>
                    </Box>
                    : <Box sx={{
                        px: '20px',
                        py: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderBottom: '1px solid #e0e0e0',
                        flexShrink: 0,
                        overflow: 'hidden'
                    }}>
                        <Avatar
                            src={conversation?.userAvatar}
                            sx={{
                                width: '96px',
                                height: '96px',
                                marginBottom: 2
                            }} />
                        <Typography sx={{
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            marginBottom: 0.5
                        }}>{conversation?.userName}</Typography>
                    </Box>
                }
                <Box sx={{ borderBottom: '1px solid #e0e0e0', flexGrow: 1, overflow: 'hidden' }}>
                    {conversation.conversationType === TYPE.GROUP ?
                        <List
                            sx={{
                                width: '100%',
                                height: '100%',
                                bgcolor: 'background.paper',
                                position: 'relative',
                                overflow: 'auto',
                            }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
                                <Typography sx={{ fontWeight: 'bold' }}>{members.length} Members</Typography>
                                <IconButton size='large' onClick={() => setOpenAddDialog(true)}>
                                    <AddCircleIcon fontSize='small' />
                                </IconButton>
                            </Box>
                            {members.map((member) => (
                                <ListItemButton
                                    key={member.userId}
                                    sx={{ p: 0 }}
                                    selected={selectedIndex === member.userId}
                                    onClick={(event) => handleListItemClick(event, member.userId)}
                                >
                                    <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Badge
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'right',
                                                }}
                                                variant="dot"
                                                color="success">
                                                <Avatar alt="Remy Sharp" src={member.userAvatar} />
                                            </Badge>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={member.userName}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        sx={{ color: 'text.primary', display: 'inline' }}
                                                    >
                                                        {member?.isOnline}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />
                                        {user?.id !== member?.userId && member?.userRole !== 'ADMIN' && (
                                            <Box sx={{ height: '100%', }}>
                                                <IconButton onClick={e => handleDelete(member)} size='large' color='error'>
                                                    <Close fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </ListItem>
                                </ListItemButton>
                            ))}
                        </List> :
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            px: 3,
                            py: 2,
                            gap: 2,
                            borderBottom: '1px solid #e0e0e0'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{
                                    backgroundColor: 'rgb(240, 242, 245)',
                                    p: 1,
                                    borderRadius: '50%'
                                }}>
                                    <EmailOutlined sx={{ color: 'text.secondary' }} />
                                </Box>
                                <Box sx={{
                                    flexGrow: 1,
                                    ml: 2
                                }}>
                                    <Typography fontSize={13} color="text.secondary">Email</Typography>
                                    <Typography fontSize={14} variant="body2" color="text.primary">{user.email}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    }
                </Box>
                <Box sx={{ borderBottom: '1px solid #e0e0e0', flexShrink: 0 }}>
                    <Typography sx={{ px: 2, py: 2, fontWeight: '600' }}>Settings</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <NotificationsNoneIcon sx={{ color: 'text.secondary' }} fontSize='large' />
                            <Typography sx={{ ml: 1 }}>Notifications</Typography>
                        </Box>
                        <SwitchCustom />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ShieldIcon sx={{ color: 'text.secondary' }} fontSize='large' />
                            <Typography sx={{ ml: 1 }}>Block User</Typography>
                        </Box>
                        <SwitchCustom />
                    </Box>
                </Box>
                {conversation.conversationType === TYPE.GROUP ? (
                    <Box sx={{ display: 'flex', px: 1, py: 2, flexShrink: 0 }}>
                        <Button sx={{
                            width: '50%',
                            py: 1,
                            mx: 1,
                            backgroundColor: 'oklch(97.1% 0.013 17.38)',
                            fontWeight: 'bold'
                        }} color='error' onClick={() => leaveGroup(conversation?.conversationId)}>Leave Group</Button>
                        <Button sx={{
                            width: '50%',
                            py: 1,
                            mx: 1,
                            backgroundColor: 'oklch(97.1% 0.013 17.38)',
                            fontWeight: 'bold'
                        }} color='error' > Delete Group</Button>
                    </Box>
                ) : (
                    <Box sx={{ px: 1, py: 2, flexShrink: 0 }}>
                        <Button sx={{
                            width: '100%',
                            py: 1,
                            backgroundColor: 'oklch(97.1% 0.013 17.38)',
                            fontWeight: 'bold'
                        }} color='error'>Delete Chat</Button>
                    </Box>
                )}
            </Paper >
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