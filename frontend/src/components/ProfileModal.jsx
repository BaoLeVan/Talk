import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useState } from "react";
import { RemoveCircleOutline } from "@mui/icons-material";
import DialogConfirm from "./Form/DialogConfirm";

export default function ProfileModal({ open, onClose, user, showAddFriendButton = false, showRemoveFriendButton = false, onSendFriendRequest, onRemoveFriendRequest }) {
  const [sending, setSending] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = () => {
    setOpenDialog(true)
  }

  if (!user) return null;

  const handleSendRequest = async () => {
    if (sending) return;
    setSending(true);
    try {
      await onSendFriendRequest(user.id);
    } finally {
      setSending(false);
    }
  };

  const handleUnfriend = async (friendUserId) => {
    try {
      unfriendAction(sendMessage)(friendUserId);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(15, 23, 42, 0.18)'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: 700, pb: 0, pt: 3 }}>
          Profile
        </DialogTitle>
        <DialogContent sx={{ px: 3, pt: 2.5 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 2, gap: 1.5 }}>
            <Avatar
              src={user.avatar}
              alt={user.userName}
              sx={{ width: 96, height: 96, fontSize: 36, boxShadow: '0 10px 24px rgba(0,0,0,0.12)' }}
            >
              {user.userName?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h6" fontWeight={700}>
              {user.userName}
            </Typography>
          </Box>

          <Divider sx={{ mb: 2.5 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, borderRadius: 3, bgcolor: '#f8fafc' }}>
              <PersonIcon color="action" fontSize="small" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Username
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.userName}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, borderRadius: 3, bgcolor: '#f8fafc' }}>
              <EmailIcon color="action" fontSize="small" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.email}</Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1, flexDirection: 'column', gap: 1 }}>
          {showAddFriendButton && (
            <Button
              onClick={handleSendRequest}
              variant="contained"
              fullWidth
              disabled={sending}
              startIcon={<PersonAddIcon />}
              sx={{ borderRadius: 999, textTransform: 'none', py: 1 }}
            >
              {sending ? 'Đang gửi...' : 'Kết bạn'}
            </Button>
          )}
          {
            showRemoveFriendButton && (
              <Button
                onClick={() => handleDelete()}
                variant="outlined"
                color="error"
                fullWidth
                disabled={sending}
                startIcon={<RemoveCircleOutline />}
                sx={{ borderRadius: 999, textTransform: 'none', py: 1 }}
              >
                Hủy kết bạn
              </Button>
            )
          }
          <Button onClick={onClose} variant="outlined" fullWidth sx={{ borderRadius: 999, textTransform: 'none', py: 1 }}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      <DialogConfirm
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        title={`Delete User ${user?.userName}`}
        description={`Are you sure you want to delete ${user?.userName}?`}
        handleFunction={() => handleUnfriend(user?.id)}
      />
    </>
  );
}
