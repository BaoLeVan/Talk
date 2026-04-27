import React, { useEffect, useState } from 'react'
import { Box, Typography, Avatar, Dialog, IconButton } from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';

function MessageItem({ messages, setMessages }) {
  const [dataDump, setDataDump] = useState([{
    content: 'Example message content',
    files: [],
    time: '10:00',
    isOwnMessage: false,
    senderName: 'Huy',
    avatar: 'https://mui.com/static/images/avatar/2.jpg',
    showAvatar: true,
    status: 'read'
  },
  {
    content: 'Example message content',
    files: [],
    time: '10:00',
    isOwnMessage: true,
    senderName: 'Bao',
    avatar: 'https://mui.com/static/images/avatar/3.jpg',
    showAvatar: true,
    status: 'read'
  },
  {
    content: 'Example message content',
    files: [],
    time: '10:00',
    isOwnMessage: false,
    senderName: 'Alex',
    avatar: 'https://mui.com/static/images/avatar/1.jpg',
    showAvatar: true,
    status: 'read'
  },
  {
    content: 'Example message content',
    files: [],
    time: '10:00',
    isOwnMessage: false,
    senderName: 'Alex',
    avatar: 'https://mui.com/static/images/avatar/1.jpg',
    showAvatar: true,
    status: 'read'
  }]);

  const [previewMedia, setPreviewMedia] = useState(null);

  useEffect(() => {
    if (messages && messages.content) {
      setDataDump((prev) => [...prev, messages])
    }
  }, [messages])

  return (
    <>
      {dataDump.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: item.isOwnMessage ? 'row-reverse' : 'row',
            alignItems: 'flex-start',
            mb: 2,
            px: 2,
            gap: 1.5,
          }}
        >
          {/* Avatar space for received messages */}
          {!item.isOwnMessage && (
            <Box sx={{ width: 40, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {item.showAvatar && (
                <Avatar src={item.avatar} alt={item.senderName || 'Avatar'} sx={{ width: 40, height: 40 }} />
              )}
            </Box>
          )}

          {/* Message content container */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: item.isOwnMessage ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>

            {/* Sender Name */}
            {!item.isOwnMessage && item.showAvatar && item.senderName && (
              <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, ml: 1, fontSize: '0.75rem' }}>
                {item.senderName}
              </Typography>
            )}

            {/* Messages Container (Text + Files Stacked) */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: item.isOwnMessage ? 'flex-end' : 'flex-start' }}>
              {/* Text Bubble */}
              {item.content && (
                <Box
                  sx={{
                    py: 1,
                    px: 2,
                    bgcolor: item.isOwnMessage ? '#1472ff' : '#f0f2f5', // Blue for own, light grey for received
                    color: item.isOwnMessage ? 'white' : 'text.primary',
                    borderRadius: '20px',
                    wordWrap: 'break-word',
                    boxShadow: 'none',
                    maxWidth: '100%',
                  }}
                >
                  <Typography variant="body1" sx={{ fontSize: '0.9375rem', lineHeight: 1.4 }}>
                    {item.content}
                  </Typography>
                </Box>
              )}

              {/* Files Container */}
              {item.files && item.files.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: item.isOwnMessage ? 'flex-end' : 'flex-start' }}>
                  {(() => {
                    const images = item.files.filter(f => f.type.startsWith('image/'));
                    const otherFiles = item.files.filter(f => !f.type.startsWith('image/'));

                    return (
                      <>
                        {/* Grouped Images */}
                        {images.length > 0 && (
                          <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 0.5, 
                            justifyContent: item.isOwnMessage ? 'flex-end' : 'flex-start',
                            maxWidth: 242 // 120 + 120 + 2 gap
                          }}>
                            {images.map((file, i) => (
                              <Box key={`img-${i}`} 
                                onClick={() => setPreviewMedia({ url: file.url, type: file.type })}
                                sx={{
                                  position: 'relative',
                                  width: images.length === 1 ? 'auto' : 118,
                                  height: images.length === 1 ? 'auto' : 118,
                                  maxWidth: 240,
                                  maxHeight: 320,
                                  borderRadius: '12px',
                                  overflow: 'hidden',
                                  border: '1px solid #e0e0e0',
                                  bgcolor: 'background.paper',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer'
                                }}
                              >
                                <img src={file.url} alt={file.name || 'image'} style={{ width: '100%', height: '100%', objectFit: images.length === 1 ? 'contain' : 'cover', display: 'block' }} />
                              </Box>
                            ))}
                          </Box>
                        )}

                        {/* Videos and Files */}
                        {otherFiles.map((file, i) => {
                          const isVideo = file.type.startsWith('video/');

                          if (isVideo) {
                            return (
                              <Box key={`media-${i}`} 
                                onClick={() => setPreviewMedia({ url: file.url, type: file.type })}
                                sx={{
                                  position: 'relative',
                                  maxWidth: 240,
                                  maxHeight: 320,
                                  borderRadius: '16px',
                                  overflow: 'hidden',
                                  border: '1px solid #e0e0e0',
                                  bgcolor: 'background.paper',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer'
                                }}>
                                <video src={file.url} style={{ width: '240px', height: 'auto', maxHeight: 320, objectFit: 'cover', display: 'block' }} />
                                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.3)' }}>
                                  <Box sx={{ 
                                    width: 48, 
                                    height: 48, 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(4px)'
                                  }}>
                                    <Box sx={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '14px solid white', ml: '4px' }} />
                                  </Box>
                                </Box>
                              </Box>
                            );
                          } else {
                            return (
                              <Box key={`file-${i}`} 
                                component="a"
                                href={file.url}
                                download={file.name || 'download'}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1.5,
                                  p: 1.5,
                                  maxWidth: 300,
                                  borderRadius: '12px',
                                  bgcolor: '#333333',
                                  color: 'white',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                  textDecoration: 'none',
                                  cursor: 'pointer',
                                  '&:hover': {
                                    opacity: 0.9
                                  }
                                }}>
                                <Box sx={{ 
                                  p: 1, 
                                  borderRadius: '8px', 
                                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  <InsertDriveFileIcon sx={{ color: '#ffffff' }} />
                                </Box>
                                <Box sx={{ overflow: 'hidden' }}>
                                  <Typography variant="body2" sx={{ 
                                    fontWeight: 500,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis' 
                                  }}>
                                    {file.name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    {file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'File'}
                                  </Typography>
                                </Box>
                              </Box>
                            );
                          }
                        })}
                      </>
                    );
                  })()}
                </Box>
              )}
            </Box>
            {/* Time and Read Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 0.5, px: 1 }}>
              {item.isOwnMessage && item.status === 'read' && (
                <DoneAllIcon sx={{ fontSize: 16, color: '#1472ff' }} />
              )}
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                {item.time}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))
      }

      {/* Media Preview Modal */}
      <Dialog 
        open={!!previewMedia} 
        onClose={() => setPreviewMedia(null)}
        maxWidth="xl"
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0,0,0,0.9)',
            boxShadow: 'none',
            margin: 0,
            maxWidth: '100%',
            maxHeight: '100%',
            width: '100vw',
            height: '100vh',
            borderRadius: 0,
          }
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconButton 
            onClick={() => setPreviewMedia(null)}
            sx={{ position: 'absolute', top: 16, right: 16, color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
          >
            <CloseIcon />
          </IconButton>
          {previewMedia?.type.startsWith('video/') ? (
            <video src={previewMedia.url} controls autoPlay style={{ maxWidth: '100%', maxHeight: '100%', outline: 'none' }} />
          ) : (
            <img src={previewMedia?.url} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          )}
        </Box>
      </Dialog>
    </>
  )
}

export default MessageItem