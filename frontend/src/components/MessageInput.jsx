import { Box, FormControl, IconButton, Input, Typography } from '@mui/material'
import React, { useCallback, useRef, useState } from 'react'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import EmojiPicker from 'emoji-picker-react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { acceptFilesValidator } from '~/utils/common';
import { toast } from 'react-toastify';

function MessageInput({ setMessages }) {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);
  const onDrop = useCallback((acceptedFiles) => {

    for (const acceptedFile of acceptedFiles) {
      const error = acceptFilesValidator(acceptedFile);
      if (error) {
        toast.error(error);
        return;
      }
    }

    const newFiles = acceptedFiles.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      size: file.size
    }));
    setFiles(prevFiles => [...prevFiles, ...newFiles]); // Lưu file vào state để xử lý sau
    inputRef.current.focus();
  }, []);

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    inputRef.current.focus();
  };

  const {
    getRootProps,
    getInputProps,
    open,
    isDragActive
  } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: {
      "image/*": [],
      "video/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
    }
  });

  const handleEmojiClick = (emoji) => {
    setShowEmojiPicker(false);
    setMessage(message + emoji.emoji);
    inputRef.current.focus();
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const handleSend = () => {
    setMessages({
      content: message,
      files: files,
      time: new Date().toLocaleTimeString(),
      isOwnMessage: true,
      senderName: 'Bao',
      avatar: 'https://mui.com/static/images/avatar/3.jpg',
      showAvatar: false,
      status: 'read',
    })
    setFiles([])
    setMessage('')
  }

  return (
    <Box {...getRootProps()} sx={{
      display: 'flex',
      flexDirection: 'column',
      p: 2,
      gap: 1,
      position: 'relative'
    }}>
      <input {...getInputProps()} />
      {/* Overlay khi drag */}
      {isDragActive && (
        <Box sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
          zIndex: 10
        }}>
          <Typography variant='body1'>Drop file here (25MB)</Typography>
        </Box>
      )}

      {/* Input Row Container */}
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, width: '100%' }}>
        <Box>
          <IconButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={open}>
            <AttachFileIcon sx={{
              rotate: '45deg'
            }} />
          </IconButton>
        </Box>
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
        <form style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }} onSubmit={handleSubmit(handleSend)}>
          <Box sx={{ flexGrow: 1 }}>
            <FormControl fullWidth>
              {/* Vùng ảo bọc cả preview và text input để trông như chúng nằm cùng trong 1 ô */}
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                p: 1,
                pl: 2,
                borderRadius: '20px',
                backgroundColor: 'oklch(0.967 0.003 264.542)',
                border: '1px solid transparent',
                transition: 'border 0.2s',
                '&:focus-within': {
                  border: '1px solid #4e93ccff',
                }
              }}>
                {/* File Previews nằm TRONG vùng box */}
                {files.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {files.map((file, index) => (
                      <Box key={index} sx={{
                        position: 'relative',
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid #e0e0e0',
                        bgcolor: 'background.paper'
                      }}>
                        {file.type.startsWith('image/') ? (
                          <img src={file.url} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : file.type.startsWith('video/') ? (
                          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                            <video src={file.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.3)' }}>
                              <Box sx={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '14px solid white', ml: '4px' }} />
                            </Box>
                          </Box>
                        ) : (
                          <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 0.5, bgcolor: '#e3f2fd', color: '#1976d2' }}>
                            <InsertDriveFileIcon sx={{ fontSize: 28 }} />
                            <Typography variant="caption" sx={{
                              fontSize: '0.6rem',
                              wordBreak: 'break-all',
                              textAlign: 'center',
                              lineHeight: 1,
                              mt: 0.5,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical'
                            }}>{file.name}</Typography>
                          </Box>
                        )}
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleRemoveFile(index); }}
                          sx={{
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            bgcolor: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            padding: '2px',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 12 }} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}

                <Input
                  ref={inputRef}
                  placeholder='Type a message...'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{
                    p: 0,
                    lineHeight: '1.5',
                    fontSize: '1rem',
                    fontWeight: '400',
                  }}
                  disableUnderline
                  multiline
                  maxRows={4}
                />
              </Box>
            </FormControl>
          </Box>
          <Box>
            {message || files.length > 0 ? (<IconButton
              type='submit'
              sx={{
                ml: 1,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                rotate: '-45deg'
              }}>
              <SendIcon />
            </IconButton>) : (<IconButton
              type='submit'
              sx={{
                ml: 1,
                bgcolor: 'oklch(87.2% .01 258.338)',
                color: 'white',
                rotate: '-45deg'
              }}
            >
              <SendIcon />
            </IconButton>)}
          </Box>
        </form>
      </Box>
    </Box >
  )
}

export default MessageInput