import { Avatar, Box, Paper, Typography, List, ListItem, ListItemAvatar, ListItemText, Badge, Switch, Button, IconButton } from '@mui/material'
import React from 'react'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ShieldIcon from '@mui/icons-material/Shield';
import { styled } from '@mui/material/styles';
import { Circle, Close } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function RightPanel() {

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
                <List
                    sx={{
                        width: '100%',
                        height: '100%',
                        bgcolor: 'background.paper',
                        position: 'relative',
                        overflow: 'auto',
                    }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
                        <Typography sx={{ fontWeight: 'bold' }}>4 Members</Typography>
                        <IconButton size='large'>
                            <AddCircleIcon fontSize='small' />
                        </IconButton>
                    </Box>
                    {[...Array(10)].map((_, index) => (
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>

                                <Badge
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    variant="dot"
                                    color="success">
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                </Badge>
                            </ListItemAvatar>
                            <ListItemText
                                primary="Brunch this weekend?"
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            sx={{ color: 'text.primary', display: 'inline' }}
                                        >
                                            Online
                                        </Typography>
                                    </React.Fragment>
                                }
                            />
                            <Box sx={{ height: '100%', }}>
                                <IconButton size='large' color='error'>
                                    <Close fontSize="small" />
                                </IconButton>
                            </Box>
                        </ListItem>
                    ))}
                </List>
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
        </Paper >
    )
}

export default RightPanel