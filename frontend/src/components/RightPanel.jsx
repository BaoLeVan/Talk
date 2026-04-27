import { Avatar, Box, Paper, Typography, List, ListItem, ListItemAvatar, ListItemText, Badge, Switch, Button, IconButton, ListItemButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ShieldIcon from '@mui/icons-material/Shield';
import { styled } from '@mui/material/styles';
import { Close, EmailOutlined } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CallIcon from '@mui/icons-material/Call';
import DialogConfirm from './Form/DialogConfirm';

const TYPE = {
    PRIVATE: 'PRIVATE',
    GROUP: 'GROUP'
}

function RightPanel({ conversation }) {
    const [users, setUsers] = useState([{
        name: 'User 1',
        avatar: 'https://i.pravatar.cc/150?img=1',
        status: 'online'
    },
    {
        name: 'User 2',
        avatar: 'https://i.pravatar.cc/150?img=2',
        status: 'offline'
    },
    {
        name: 'User 3',
        avatar: 'https://i.pravatar.cc/150?img=3',
        status: 'online'
    },
    {
        name: 'User 4',
        avatar: 'https://i.pravatar.cc/150?img=4',
        status: 'offline'
    }]);
    const [userDelete, setUserDelete] = useState(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const user = {
        email: 'levannhatbao29@gmail.com',
        phone: '0768568962'
    }

    useEffect(() => {
        if (conversation.type === TYPE.GROUP) {

        }
    }, [conversation, users])

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    const handleDelete = (userDelete) => {
        setOpenDialog(true)
        setUserDelete(userDelete)
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
                    <Avatar sx={{
                        width: '96px',
                        height: '96px',
                        marginBottom: 2
                    }}></Avatar>
                    <Typography sx={{
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        marginBottom: 0.5
                    }}>Contact Info</Typography>
                    <Typography sx={{
                        fontSize: '0.8rem',
                        color: 'text.secondary'
                    }}>Active now</Typography>
                </Box>
                <Box sx={{ borderBottom: '1px solid #e0e0e0', flexGrow: 1, overflow: 'hidden' }}>
                    {conversation.type === TYPE.GROUP ?
                        <List
                            sx={{
                                width: '100%',
                                height: '100%',
                                bgcolor: 'background.paper',
                                position: 'relative',
                                overflow: 'auto',
                            }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
                                <Typography sx={{ fontWeight: 'bold' }}>{users.length} Members</Typography>
                                <IconButton size='large'>
                                    <AddCircleIcon fontSize='small' />
                                </IconButton>
                            </Box>
                            {users.map((user, index) => (
                                <ListItemButton
                                    key={index}
                                    sx={{ p: 0 }}
                                    selected={selectedIndex === index}
                                    onClick={(event) => handleListItemClick(event, index)}
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
                                                <Avatar alt="Remy Sharp" src={user.avatar} />
                                            </Badge>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={user.name}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        sx={{ color: 'text.primary', display: 'inline' }}
                                                    >
                                                        {user.status}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />
                                        <Box sx={{ height: '100%', }}>
                                            <IconButton onClick={e => handleDelete(user)} size='large' color='error'>
                                                <Close fontSize="small" />
                                            </IconButton>
                                        </Box>
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
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{
                                    backgroundColor: 'rgb(240, 242, 245)',
                                    p: 1,
                                    borderRadius: '50%'
                                }}>
                                    <CallIcon sx={{ color: 'text.secondary' }} />
                                </Box>
                                <Box sx={{
                                    flexGrow: 1,
                                    ml: 2
                                }}>
                                    <Typography fontSize={13} color="text.secondary">Phone</Typography>
                                    <Typography fontSize={14} variant="body2" color="text.primary">{user.phone}</Typography>
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
                {conversation.type === TYPE.GROUP ? (
                    <Box sx={{ display: 'flex', px: 1, py: 2, flexShrink: 0 }}>
                        <Button sx={{
                            width: '50%',
                            py: 1,
                            mx: 1,
                            backgroundColor: 'oklch(97.1% 0.013 17.38)',
                            fontWeight: 'bold'
                        }} color='error'>Leave Group</Button>
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
                userDelete={userDelete}
                users={users}
                setUsers={setUsers}
            />
        </>
    )
}

export default RightPanel