import React, { useMemo, useState, useRef } from 'react'
import { Box, Typography, Avatar, Dialog, IconButton, Tooltip, Popper, Paper, ClickAwayListener } from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import ReplyIcon from '@mui/icons-material/Reply';
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import { useChatStore } from '~/store/useChatStore';
import { useStomp } from '~/components/context/StompContext';
import { useUser } from '~/components/context/UserContext';

const EMOJI_LIST = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '👏'];

function ReactionBar({ reactions, messageId, conversationId }) {
  if (!reactions || reactions.length === 0) return null;

  // gom nhóm theo icon
  const grouped = reactions.reduce((acc, r) => {
    if (!acc[r.icon]) acc[r.icon] = [];
    acc[r.icon].push(r.userName || 'Unknown');
    return acc;
  }, {});

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
      {Object.entries(grouped).map(([icon, names]) => (
        <Tooltip
          key={icon}
          title={
            <Box>
              {names.map((name, i) => (
                <Typography key={i} variant='caption' sx={{ display: 'block', fontSize: '0.75rem' }}>
                  {name}
                </Typography>
              ))}
            </Box>
          }
          arrow
          placement='top'
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.4,
              px: 0.8,
              py: 0.3,
              borderRadius: '999px',
              bgcolor: '#F1F3FF',
              border: '1px solid #E0E4FF',
              cursor: 'default',
              fontSize: '0.85rem',
              lineHeight: 1,
              userSelect: 'none',
            }}
          >
            <span>{icon}</span>
            {names.length > 1 && (
              <Typography variant='caption' sx={{ fontSize: '0.72rem', color: '#5B67FF', fontWeight: 600 }}>
                {names.length}
              </Typography>
            )}
          </Box>
        </Tooltip>
      ))}
    </Box>
  );
}

function EmojiPicker({ anchorEl, open, onClose, onSelect }) {
  return (
    <Popper open={open} anchorEl={anchorEl} placement='top' style={{ zIndex: 1300 }}>
      <ClickAwayListener onClickAway={onClose}>
        <Paper
          elevation={4}
          sx={{
            display: 'flex',
            gap: 0.5,
            p: 0.75,
            borderRadius: '999px',
            border: '1px solid #EEF2FF',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          }}
        >
          {EMOJI_LIST.map((emoji) => (
            <Box
              key={emoji}
              onClick={() => onSelect(emoji)}
              sx={{
                fontSize: '1.4rem',
                cursor: 'pointer',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.15s',
                '&:hover': { transform: 'scale(1.3)', bgcolor: '#F1F3FF' },
              }}
            >
              {emoji}
            </Box>
          ))}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
}

function MessageItem() {
  const { messages, setEditingMessage } = useChatStore();
  const { sendMessage } = useStomp();
  const { user } = useUser();
  const [previewMedia, setPreviewMedia] = useState(null);
  const [pickerAnchor, setPickerAnchor] = useState(null);
  const [pickerMessageId, setPickerMessageId] = useState(null);
  const [pickerConversationId, setPickerConversationId] = useState(null);

  const sortedMessages = useMemo(() => messages ?? [], [messages]);

  const handleOpenPicker = (e, messageId, conversationId) => {
    setPickerAnchor(e.currentTarget);
    setPickerMessageId(messageId);
    setPickerConversationId(conversationId);
  };

  const handleClosePicker = () => {
    setPickerAnchor(null);
    setPickerMessageId(null);
    setPickerConversationId(null);
  };

  const handleSelectEmoji = (emoji) => {
    if (!pickerMessageId || !pickerConversationId || !user?.id) return;
    sendMessage('/app/chat.reactMessage', {
      messageId: pickerMessageId,
      conversationId: pickerConversationId,
      userId: user.id,
      icon: emoji,
    });
    handleClosePicker();
  };

  return (
    <>
      {sortedMessages.map((item, index) => {
        const isSystemMessage = item.messageType === 'SYSTEM';

        const actionButtons = item.isOwnMessage ? [
          {
            key: 'edit',
            title: 'Chỉnh sửa',
            icon: <EditIcon sx={{ fontSize: 18 }} />,
            onClick: () => setEditingMessage(item)
          },
          {
            key: 'reaction',
            title: 'Thả icon',
            icon: <AddReactionOutlinedIcon sx={{ fontSize: 18 }} />,
            onClick: (e) => handleOpenPicker(e, item.id, item.conversationId)
          },
          {
            key: 'reply',
            title: 'Trả lời',
            icon: <ReplyIcon sx={{ fontSize: 18 }} />,
            onClick: () => { }
          }
        ] : [
          {
            key: 'reply',
            title: 'Trả lời',
            icon: <ReplyIcon sx={{ fontSize: 18 }} />,
            onClick: () => { }
          },
          {
            key: 'reaction',
            title: 'Thả icon',
            icon: <AddReactionOutlinedIcon sx={{ fontSize: 18 }} />,
            onClick: (e) => handleOpenPicker(e, item.id, item.conversationId)
          }
        ];

        return (
          <Box
            key={item.id ?? index}
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
            {!item.isOwnMessage && !isSystemMessage && (
              <Box sx={{ width: 40, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar src={item.avatar} alt={item.senderName || 'Avatar'} sx={{ width: 40, height: 40, boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }} />
              </Box>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isSystemMessage ? 'center' : item.isOwnMessage ? 'flex-end' : 'flex-start', maxWidth: isSystemMessage ? '100%' : '75%' }}>
              {!item.isOwnMessage && !isSystemMessage && item.senderName && (
                <Typography variant='caption' sx={{ color: '#6B7280', mb: 0.5, ml: 1, fontSize: '0.75rem', fontWeight: 500 }}>
                  {item.senderName}
                </Typography>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: isSystemMessage ? 'center' : item.isOwnMessage ? 'flex-end' : 'flex-start' }}>
                {item.attachments && item.attachments.length > 0 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: item.isOwnMessage ? 'flex-end' : 'flex-start' }}>
                    {(() => {
                      const images = item.attachments.filter(f => f.contentType.startsWith('image/'));
                      const otherFiles = item.attachments.filter(f => !f.contentType.startsWith('image/'));

                      return (
                        <>
                          {images.length > 0 && (
                            <Box sx={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: 0.75,
                              justifyContent: item.isOwnMessage ? 'flex-end' : 'flex-start',
                              maxWidth: 242
                            }}>
                              {images.map((file, i) => (
                                <Box
                                  key={`img-${i}`}
                                  onClick={() => setPreviewMedia({ url: file.url, type: file.contentType })}
                                  sx={{
                                    position: 'relative',
                                    width: images.length === 1 ? 'auto' : 118,
                                    height: images.length === 1 ? 'auto' : 118,
                                    maxWidth: 240,
                                    maxHeight: 320,
                                    borderRadius: '18px',
                                    overflow: 'hidden',
                                    border: '1px solid #EEF2FF',
                                    bgcolor: '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                                  }}
                                >
                                  <img src={file.url} alt={file.fileName || 'image'} style={{ width: '100%', height: '100%', objectFit: images.length === 1 ? 'contain' : 'cover', display: 'block' }} />
                                </Box>
                              ))}
                            </Box>
                          )}

                          {otherFiles.map((file, i) => {
                            const isVideo = file.contentType.startsWith('video/');

                            if (isVideo) {
                              return (
                                <Box
                                  key={`media-${i}`}
                                  onClick={() => setPreviewMedia({ url: file.url, type: file.contentType })}
                                  sx={{
                                    position: 'relative',
                                    maxWidth: 240,
                                    maxHeight: 320,
                                    borderRadius: '18px',
                                    overflow: 'hidden',
                                    border: '1px solid #EEF2FF',
                                    bgcolor: '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                                  }}>
                                  <video src={file.url} style={{ width: '240px', height: 'auto', maxHeight: 320, objectFit: 'cover', display: 'block' }} />
                                  <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.28)' }}>
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
                            }

                            return (
                              <Box
                                key={`file-${i}`}
                                component='a'
                                href={file.url}
                                download={file.fileName || 'download'}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1.5,
                                  p: 1.5,
                                  maxWidth: 300,
                                  borderRadius: '18px',
                                  bgcolor: '#FFFFFF',
                                  color: '#111827',
                                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                  textDecoration: 'none',
                                  cursor: 'pointer',
                                  border: '1px solid #EEF2FF',
                                  '&:hover': { transform: 'scale(1.01)' }
                                }}>
                                <Box sx={{
                                  p: 1,
                                  borderRadius: '12px',
                                  bgcolor: '#EEF2FF',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  <InsertDriveFileIcon sx={{ color: '#5B67FF' }} />
                                </Box>
                                <Box sx={{ overflow: 'hidden' }}>
                                  <Typography variant='body2' sx={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {file.fileName}
                                  </Typography>
                                  <Typography variant='caption' sx={{ color: '#94A3B8' }}>
                                    {file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'File'}
                                  </Typography>
                                </Box>
                              </Box>
                            );
                          })}
                        </>
                      );
                    })()}
                  </Box>
                )}

                {item.content && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: item.isOwnMessage ? 'row-reverse' : 'row',
                      alignItems: 'center',
                      gap: 1,
                      '&:hover .message-actions': {
                        opacity: 1,
                        visibility: 'visible',
                        transform: 'translateY(0)'
                      }
                    }}
                  >
                    <Tooltip title={item.updateAt} placement='right' arrow>
                      <Box sx={{
                        py: isSystemMessage ? 0.5 : 1.5,
                        px: isSystemMessage ? 1.5 : 2.5,
                        bgcolor: isSystemMessage ? 'transparent' : item.isOwnMessage ? 'transparent' : '#FFFFFF',
                        background: isSystemMessage ? 'transparent' : item.isOwnMessage ? 'linear-gradient(135deg, #6EA8FE 0%, #5B67FF 50%, #7C5CFF 100%)' : '#FFFFFF',
                        color: isSystemMessage ? '#6B7280' : item.isOwnMessage ? 'white' : '#111827',
                        borderRadius: isSystemMessage ? '8px' : '24px',
                        wordWrap: 'break-word',
                        boxShadow: isSystemMessage ? 'none' : '0 10px 30px rgba(0,0,0,0.05)',
                        maxWidth: '100%',
                        fontStyle: isSystemMessage ? 'italic' : 'normal',
                        border: isSystemMessage ? 'none' : item.isOwnMessage ? 'none' : '1px solid #EEF2FF'
                      }}>
                        <Typography variant='body1' sx={{ fontSize: isSystemMessage ? '0.8125rem' : '0.9375rem', lineHeight: 1.5 }}>
                          {item.content}
                        </Typography>
                      </Box>
                    </Tooltip>
                    {!isSystemMessage && (
                      <Box
                        className='message-actions'
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          opacity: 0,
                          visibility: 'hidden',
                          transform: 'translateY(4px)',
                          transition: 'all 0.18s ease',
                          bgcolor: '#FFFFFF',
                          border: '1px solid #EEF2FF',
                          borderRadius: '999px',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                          px: 0.5,
                          py: 0.25,
                        }}
                      >
                        {actionButtons.map((action) => (
                          <Tooltip key={action.key} title={action.title} arrow>
                            <IconButton
                              size='small'
                              onClick={action.onClick}
                              sx={{
                                color: '#6B7280',
                                '&:hover': {
                                  color: '#5B67FF',
                                  bgcolor: '#F1F3FF'
                                }
                              }}
                            >
                              {action.icon}
                            </IconButton>
                          </Tooltip>
                        ))}
                      </Box>
                    )}
                  </Box>
                )}

                {!isSystemMessage && (
                  <ReactionBar
                    reactions={item.reactions}
                    messageId={item.id}
                    conversationId={item.conversationId}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 0.5, px: 1 }}>
                {item.isOwnMessage && item.status === 'read' && (
                  <DoneAllIcon sx={{ fontSize: 16, color: '#5B67FF' }} />
                )}
              </Box>
            </Box>
          </Box>
        );
      })}

      <EmojiPicker
        anchorEl={pickerAnchor}
        open={Boolean(pickerAnchor)}
        onClose={handleClosePicker}
        onSelect={handleSelectEmoji}
      />

      <Dialog
        open={!!previewMedia}
        onClose={() => setPreviewMedia(null)}
        maxWidth='xl'
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
