import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  Typography,
} from '@mui/material';
import { useStomp } from '~/components/context/StompContext';
import { useFriendStore } from '~/store/useFriendStore';
import { useState, useEffect } from 'react';
import { NotificationsNoneRounded } from '@mui/icons-material';
import { COLORS, formatTimeChat } from '~/utils/common';
import { useUser } from '~/components/context/UserContext';

export default function FriendRequestsReceived() {
  const { receivedRequests, acceptRequest, rejectRequest, loading, fetchReceivedRequests } = useFriendStore();
  const { user, isLoading } = useUser();
  const { sendMessage } = useStomp();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAccept = async (requestId) => {
    try {
      acceptRequest(sendMessage)(requestId);
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    }
  };

  useEffect(() => {
    if (isLoading || !user?.id) return;
    fetchReceivedRequests();
  }, [fetchReceivedRequests, isLoading, user?.id]);

  const handleReject = async (requestId) => {
    try {
      rejectRequest(sendMessage)(requestId);
    } catch (error) {
      console.error('Failed to reject friend request:', error);
    }
  };

  return (
    <>
      <IconButton
        size="large"
        aria-controls={open ? 'notification-drop-down' : undefined}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={handleClick}
        sx={{ borderRadius: '12px', color: COLORS.textSecondary, '&:hover': { bgcolor: COLORS.primaryHover, color: COLORS.primary } }}
      >
        <Badge color="secondary" badgeContent={receivedRequests.length} max={9}>
          <NotificationsNoneRounded fontSize="inherit" />
        </Badge>
      </IconButton>

      <Menu
        id="notification-drop-down"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: {
            width: 380,
            maxWidth: '92vw',
            mt: 1,
            maxHeight: 480,
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(15, 23, 42, 0.14)',
            border: '1px solid #EEF2FF'
          }
        }}
      >
        <Box sx={{ px: 2.5, py: 2, background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FF 100%)' }}>
          <Typography sx={{ fontWeight: 800, fontSize: '17px', color: COLORS.text }}>Notifications</Typography>
          <Typography sx={{ fontSize: '13px', color: COLORS.textMuted }}>{receivedRequests.length} pending friend requests</Typography>
        </Box>
        <Divider />

        {(!receivedRequests || receivedRequests.length === 0) && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 700, color: COLORS.text, mb: 0.75 }}>No notifications</Typography>
            <Typography sx={{ fontSize: '13px', color: COLORS.textMuted }}>Friend requests will appear here.</Typography>
          </Box>
        )}

        <Box sx={{ maxHeight: 380, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
          {receivedRequests.map((request, index) => (
            <Box key={request.id} sx={{ px: 1.25, py: 1.25 }}>
              <Box sx={{ p: 1.5, borderRadius: '20px', bgcolor: '#FFFFFF', border: '1px solid #EEF2FF', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
                <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                  <Avatar src={request.senderAvatar} alt={request.senderName} sx={{ width: 46, height: 46, boxShadow: '0 8px 18px rgba(0,0,0,0.08)' }}>
                    {request.senderName?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 800, fontSize: '14px', color: COLORS.text }}>
                        {request.senderName}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', color: COLORS.textMuted, flexShrink: 0 }}>
                        {formatTimeChat(request.createdAt)}
                      </Typography>
                    </Box>
                    <Typography sx={{ mt: 0.5, fontSize: '13px', color: COLORS.textSecondary, lineHeight: 1.6 }}>
                      {request.message || 'wants to be your friend'}
                    </Typography>
                    <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleAccept(request.id)}
                        disabled={loading}
                        sx={{ borderRadius: '999px', textTransform: 'none', fontWeight: 700, px: 2, boxShadow: 'none', background: 'linear-gradient(135deg, #6EA8FE 0%, #5B67FF 55%, #7C5CFF 100%)' }}
                      >
                        Accept
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleReject(request.id)}
                        disabled={loading}
                        sx={{ borderRadius: '999px', textTransform: 'none', fontWeight: 700, px: 2, borderColor: '#FECACA', color: '#DC2626' }}
                      >
                        Reject
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
              {index < receivedRequests.length - 1 && <Box sx={{ height: 2 }} />}
            </Box>
          ))}
        </Box>
      </Menu>
    </>
  );
}
