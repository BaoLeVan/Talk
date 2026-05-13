import { Avatar, Badge, Box, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import { useStomp } from "~/components/context/StompContext";
import { useFriendStore } from "~/store/useFriendStore";
import { useState, useEffect } from "react";
import { Notifications } from "@mui/icons-material";

export default function FriendRequestsReceived() {
  const { receivedRequests, acceptRequest, rejectRequest, loading, fetchReceivedRequests } = useFriendStore();
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
      console.error("Failed to accept friend request:", error);
    }
  };

  useEffect(() => {
    fetchReceivedRequests();
  }, []);

  const handleReject = async (requestId) => {
    try {
      rejectRequest(sendMessage)(requestId);
    } catch (error) {
      console.error("Failed to reject friend request:", error);
    }
  };

  return (
    <>
      <IconButton size="large"
        aria-controls={open ? 'notification-drop-down' : undefined}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={handleClick}>
        <Badge color="secondary" badgeContent={receivedRequests.length}>
          <Notifications fontSize='inherit' />
        </Badge>
      </IconButton>
      <Menu
        id="notification-drop-down"
        aria-labelledby="notification-drop-down-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: { width: 360, maxWidth: "90vw", mt: 1, maxHeight: 420 },
        }}
      >
        {(!receivedRequests || receivedRequests.length === 0) && (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No friend requests received
            </Typography>
          </Box>
        )}
        {receivedRequests.map((request) => (
          <MenuItem
            key={request.id}
            alignItems="flex-start"
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              "&:last-child": { borderBottom: "none" },
            }}
          >
            <ListItemAvatar>
              <Avatar src={request.senderAvatar} alt={request.senderName}>
                {request.senderName?.charAt(0).toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={request.senderName}
              secondary={
                <>
                  <Typography variant="body2" color="text.primary" component="span">
                    {request.message || "wants to be your friend"}
                  </Typography>
                  <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleAccept(request.id)}
                      disabled={loading}
                    >
                      Accept
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleReject(request.id)}
                      disabled={loading}
                    >
                      Reject
                    </Button>
                  </Box>
                </>
              }
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
