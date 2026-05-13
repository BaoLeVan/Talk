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
import { useUser } from './context/UserContext';
import { uploadFile } from '~/apis/attachmentApi';

function MessageInput({ conversation, sendMessage }) {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const { user } = useUser();

  const onDrop = useCallback((acceptedFiles) => {
    for (const acceptedFile of acceptedFiles) {
      const error = acceptFilesValidator(acceptedFile);
      if (error) {
        toast.error(error);
        return;
      }
    }

    const newFiles = acceptedFiles.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    inputRef.current?.focus();
  }, []);

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    inputRef.current?.focus();
  };

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: {
      'image/*': [],
      'video/*': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': [],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
    }
  });

  const handleEmojiClick = (emoji) => {
    setShowEmojiPicker(false);
    setMessage(message + emoji.emoji);
    inputRef.current?.focus();
  }

  const { handleSubmit } = useForm()

  const handleSend = async () => {
    if (!conversation || !user || (!message && files.length === 0)) return;

    try {
      setUploading(true);
      const attachments = await Promise.all(files.map(f => uploadFile(f.file)));

      sendMessage('/app/chat.sendMessage', {
        senderId: user.id,
        conversationId: conversation.conversationId,
        content: message,
        messageType: 'CHAT',
        attachments
      })

      setFiles([])
      setMessage('')
    } catch (error) {
      toast.error('Failed to upload files');
      setFiles([])
      setMessage('')
    } finally {
      setUploading(false);
    }
  }

  return (
    <Box {...getRootProps()} sx={{ position: 'relative' }}>
      <input {...getInputProps()} />

      {isDragActive && (
        <Box sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(91,103,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '28px',
          border: '2px dashed #5B67FF',
          zIndex: 10
        }}>
          <Typography variant='body2' sx={{ color: '#5B67FF', fontWeight: 600 }}>Drop file here (25MB)</Typography>
        </Box>
      )}

      <Box sx={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 1,
        background: '#FFFFFF',
        borderRadius: '28px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        px: 2,
        py: 1.5,
        position: 'relative'
      }}>
        <IconButton onClick={open} sx={{ color: '#6B7280', '&:hover': { color: '#5B67FF', bgcolor: '#F1F3FF' } }}>
          <AttachFileIcon sx={{ rotate: '45deg' }} fontSize='small' />
        </IconButton>

        <Box sx={{ position: 'relative' }}>
          <IconButton title='Add emoji' onClick={() => setShowEmojiPicker(!showEmojiPicker)} sx={{ color: '#6B7280', '&:hover': { color: '#5B67FF', bgcolor: '#F1F3FF' } }}>
            <SentimentSatisfiedIcon fontSize='small' />
          </IconButton>
          {showEmojiPicker && (
            <Box sx={{ position: 'absolute', bottom: '100%', left: 0, zIndex: 20 }}>
              <EmojiPicker onEmojiClick={handleEmojiClick} width={320} height={400} />
            </Box>
          )}
        </Box>

        <form style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8 }} onSubmit={handleSubmit(handleSend)}>
          <Box sx={{ flexGrow: 1 }}>
            <FormControl fullWidth>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                px: 2,
                py: 1.25,
                borderRadius: '24px',
                backgroundColor: '#F8F9FC',
                border: '1px solid transparent',
                transition: 'all 0.2s ease',
                '&:focus-within': {
                  borderColor: '#5B67FF',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 0 0 3px rgba(91,103,255,0.08)'
                }
              }}>
                {files.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {files.map((fileItem, index) => (
                      <Box key={index} sx={{
                        position: 'relative',
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid #EEF2FF',
                        bgcolor: 'background.paper'
                      }}>
                        {fileItem.file.type.startsWith('image/') ? (
                          <img src={fileItem.url} alt={fileItem.file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : fileItem.file.type.startsWith('video/') ? (
                          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                            <video src={fileItem.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.3)' }}>
                              <Box sx={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '14px solid white', ml: '4px' }} />
                            </Box>
                          </Box>
                        ) : (
                          <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 0.5, bgcolor: '#EEF2FF', color: '#5B67FF' }}>
                            <InsertDriveFileIcon sx={{ fontSize: 28 }} />
                            <Typography variant='caption' sx={{ fontSize: '0.6rem', wordBreak: 'break-all', textAlign: 'center', lineHeight: 1, mt: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                              {fileItem.file.name}
                            </Typography>
                          </Box>
                        )}
                        <IconButton
                          size='small'
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
                    fontWeight: 400,
                    color: '#111827'
                  }}
                  disableUnderline
                  multiline
                  maxRows={4}
                />
              </Box>
            </FormControl>
          </Box>

          <Box>
            <IconButton
              type='submit'
              disabled={uploading || (!message && files.length === 0)}
              sx={{
                ml: 1,
                width: 44,
                height: 44,
                borderRadius: '999px',
                bgcolor: message || files.length > 0 ? 'transparent' : '#D1D5DB',
                background: message || files.length > 0
                  ? 'linear-gradient(135deg, #6EA8FE 0%, #5B67FF 50%, #7C5CFF 100%)'
                  : '#D1D5DB',
                color: '#FFFFFF',
                boxShadow: message || files.length > 0 ? '0 8px 20px rgba(91,103,255,0.28)' : 'none',
                rotate: '-45deg',
                '&:hover': {
                  bgcolor: message || files.length > 0 ? 'transparent' : '#D1D5DB',
                  transform: 'scale(1.02)'
                }
              }}
            >
              <SendIcon fontSize='small' />
            </IconButton>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default MessageInput
