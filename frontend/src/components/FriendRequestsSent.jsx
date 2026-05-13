import { Avatar, Badge, Box, Button, IconButton, ListItemAvatar, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useStomp } from "~/components/context/StompContext";
import { useFriendStore } from "~/store/useFriendStore";
import { Notifications } from "@mui/icons-material";
import { useState } from "react";

export default function FriendRequestsSent() {
  const { sentRequests, cancelRequest, loading } = useFriendStore();
  const { sendMessage } = useStomp();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleCancel = async (requestId) => {
    try {
      cancelRequest(sendMessage)(requestId);
    } catch (error) {
      console.error("Failed to cancel friend request:", error);
    }
  };

  return (
    <>
      <Button size="large"
        aria-controls={open ? 'notification-drop-down' : undefined}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={handleClick}
        sx={{ minWidth: 0, borderRadius: 999, color: 'text.secondary' }}>
        <Badge color="secondary" badgeContent={sentRequests.length}>
          <Notifications fontSize='inherit' />
        </Badge>
      </Button>
      <Menu
        id="notification-drop-down"
        aria-labelledby="notification-drop-down-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: { width: 360, maxWidth: "90vw", mt: 1, maxHeight: 420, borderRadius: 4, boxShadow: '0 20px 50px rgba(0,0,0,0.14)' },
        }}
      >
        {sentRequests.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">No sent requests</Typography>
          </Box>
        ) : sentRequests.map((request) => (
          <MenuItem
            key={request.id}
            sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.25, px: 2 }}
          >
            <ListItemAvatar sx={{ minWidth: 0 }}>
              <Avatar src={request.receiverAvatar} alt={request.receiverName} sx={{ width: 36, height: 36 }}>
                {request.receiverName?.charAt(0).toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{ m: 0, minWidth: 0, flex: 1 }}
              primary={request.receiverName}
              primaryTypographyProps={{ noWrap: true }}
              secondary={request.message || "Friend request sent"}
              secondaryTypographyProps={{ noWrap: true, variant: "body2", color: "text.secondary" }}
            />
            <IconButton
              edge="end"
              aria-label="cancel"
              onClick={() => handleCancel(request.id)}
              disabled={loading}
              size="small"
              sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
