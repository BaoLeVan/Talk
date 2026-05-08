import React, { useState } from 'react'
import { Box, Typography, Avatar, Dialog, IconButton, Tooltip } from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';
import { useChatStore } from './store/useChatStore';

function MessageItem() {
  const { messages } = useChatStore();
  console.log("messages", messages);

  const [previewMedia, setPreviewMedia] = useState(null);

  return (
    <>
      {messages?.map((item, index) => {
        const isSystemMessage = item.messageType === 'SYSTEM';

        return (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: isSystemMessage ? 'row' : item.isOwnMessage ? 'row-reverse' : 'row',
              alignItems: isSystemMessage ? 'center' : 'flex-start',
              justifyContent: isSystemMessage ? 'center' : 'flex-start',
              mb: 2,
              px: 2,
              gap: 1.5,
            }}
          >
            {/* Avatar space for received messages */}
            {!item.isOwnMessage && !isSystemMessage && (
              <Box sx={{ width: 40, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* {item.showAvatar && ( */}
                <Avatar src={item.avatar} alt={item.senderName || 'Avatar'} sx={{ width: 40, height: 40 }} />
                {/* )} */}
              </Box>
            )}

            {/* Message content container */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isSystemMessage ? 'center' : item.isOwnMessage ? 'flex-end' : 'flex-start', maxWidth: isSystemMessage ? '100%' : '75%' }}>

              {/* Sender Name */}
              {/* {!item.isOwnMessage && item.showAvatar && item.senderName && (
              <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, ml: 1, fontSize: '0.75rem' }}>
                {item.senderName}
              </Typography>
            )} */}
              {!item.isOwnMessage && !isSystemMessage && item.senderName && (
                <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, ml: 1, fontSize: '0.75rem' }}>
                  {item.senderName}
                </Typography>
              )}

              {/* Messages Container (Text + Files Stacked) */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: isSystemMessage ? 'center' : item.isOwnMessage ? 'flex-end' : 'flex-start' }}>
                {/* Files Container */}
                {item.attachments && item.attachments.length > 0 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: item.isOwnMessage ? 'flex-end' : 'flex-start' }}>
                    {(() => {
                      const images = item.attachments.filter(f => f.contentType.startsWith('image/'));
                      const otherFiles = item.attachments.filter(f => !f.contentType.startsWith('image/'));

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
                                  onClick={() => setPreviewMedia({ url: file.url, type: file.contentType })}
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
                                  <img src={file.url} alt={file.fileName || 'image'} style={{ width: '100%', height: '100%', objectFit: images.length === 1 ? 'contain' : 'cover', display: 'block' }} />
                                </Box>
                              ))}
                            </Box>
                          )}

                          {/* Videos and Files */}
                          {otherFiles.map((file, i) => {
                            const isVideo = file.contentType.startsWith('video/');

                            if (isVideo) {
                              return (
                                <Box key={`media-${i}`}
                                  onClick={() => setPreviewMedia({ url: file.url, type: file.contentType })}
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
                                  download={file.fileName || 'download'}
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
                                      {file.fileName}
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
                {/* Text Bubble */}
                {item.content && (
                  <Box
                    sx={{
                      py: isSystemMessage ? 0.5 : 1,
                      px: isSystemMessage ? 1.5 : 2,
                      bgcolor: isSystemMessage ? 'transparent' : item.isOwnMessage ? '#1472ff' : '#f0f2f5',
                      color: isSystemMessage ? 'text.secondary' : item.isOwnMessage ? 'white' : 'text.primary',
                      borderRadius: isSystemMessage ? '8px' : '20px',
                      wordWrap: 'break-word',
                      boxShadow: 'none',
                      maxWidth: '100%',
                      fontStyle: isSystemMessage ? 'italic' : 'normal',
                    }}
                  >
                    <Tooltip title={item.time} placement="left" arrow>
                      <Typography variant="body1" sx={{ fontSize: isSystemMessage ? '0.8125rem' : '0.9375rem', lineHeight: 1.4 }}>
                        {item.content}
                      </Typography>
                    </Tooltip>
                  </Box>
                )}
              </Box>
              {/* Time and Read Status */}
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 0.5, px: 1 }}>
                {item.isOwnMessage && item.status === 'read' && (
                  <DoneAllIcon sx={{ fontSize: 16, color: '#1472ff' }} />
                )}
              </Box>
            </Box>
          </Box>
        );
      })}


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