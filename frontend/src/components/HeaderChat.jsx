import { Avatar, Box, IconButton, Typography } from '@mui/material'
import React from 'react'
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function HeaderChat({ conversation }) {
    return (
        <Box sx={{
            display: 'flex',
            px: 3,
            py: 2,
            alignItems: 'center'
        }}>
            <Avatar src={conversation?.avatar || null}>
                
            </Avatar>
            <Box sx={{
                flexGrow: 1,
                ml: 2
            }}>
                <Typography variant="h6" color="text.primary">{conversation?.title}</Typography>
                <Typography variant="body2" color="text.secondary">Online</Typography>
            </Box>
            <Box>
                <IconButton>
                    <CallIcon />
                </IconButton>
                <IconButton>
                    <VideocamIcon />
                </IconButton>
                <IconButton>
                    <MoreVertIcon />
                </IconButton>
            </Box>
        </Box>
    )
}

export default HeaderChat