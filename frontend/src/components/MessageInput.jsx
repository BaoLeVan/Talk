import { Box, Button, FormControl, IconButton, Input } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ImageIcon from '@mui/icons-material/Image';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SendIcon from '@mui/icons-material/Send';
import EmojiPicker from 'emoji-picker-react';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';

function MessageInput({ setMessages }) {
  const [message, setMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEmojiClick = (emoji) => {
    setShowEmojiPicker(false);
    setMessage(message + emoji.emoji);
    inputRef.current.focus();
  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const hanleSend = () => {
    if (!message) return
    setMessages({
      text: message,
      time: new Date().toLocaleTimeString(),
      isOwnMessage: true,
      senderName: 'Bao',
      avatar: 'https://mui.com/static/images/avatar/3.jpg',
      showAvatar: false,
      status: 'read'
    })
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit(hanleSend)}>
      <Box sx={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 1,
        p: 2
      }}>
        <Box>
          <IconButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}>
            <AttachFileIcon sx={{
              rotate: '45deg'
            }} />
          </IconButton>
        </Box>
        {/* Option upload */}
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            list: {
              'aria-labelledby': 'basic-button',
            },
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <MenuItem component="label" onClick={handleClose}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ImageIcon sx={{ mr: 1 }} />
              Image
              <VisuallyHiddenInput
                type="file"
                onChange={(event) => console.log(event.target.files)}
                multiple
                accept='image/*'
              />
            </Box>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <OndemandVideoIcon sx={{ mr: 1 }} />
              Video
            </Box>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FileCopyIcon sx={{ mr: 1 }} />
              File
            </Box>
          </MenuItem>
        </Menu>

        <Box sx={{
          position: 'relative',
        }}>
          <IconButton title='Add enoji' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <SentimentSatisfiedIcon />
          </IconButton>
          {showEmojiPicker && (
            <Box sx={{
              position: 'absolute',
              bottom: '100%',
              left: '0',
              zIndex: 1,
            }}>
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width={320}
                height={400} />
            </Box>
          )}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <FormControl
            fullWidth
          >
            <Input
              ref={inputRef}
              placeholder='Type a message...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{
                p: 1,
                borderRadius: '20px',
                backgroundColor: 'oklch(0.967 0.003 264.542)',
                pl: 2,
                lineHeight: '1.5',
                fontSize: '1rem',
                fontWeight: '400',
                ' &:focus': {
                  border: '1px solid #4e93ccff',
                }
              }}
              disableUnderline
              multiline
              maxRows={4}
            />
          </FormControl>
        </Box>
        <Box>
          <IconButton
            type='submit'
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box >
    </form>
  )
}

export default MessageInput