import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useFriendStore } from "~/store/useFriendStore";
import { useEffect, useState } from "react";
import ProfileModal from "./ProfileModal";

export default function FriendsList() {
  const { friends, fetchFriends } = useFriendStore();
  const [selectedUser, setSelectedUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleUserClick = (friend) => {
    setSelectedUser(friend);
    setProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setProfileOpen(false);
    setSelectedUser(null);
  };


  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);


  if (friends.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          No friends yet
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: 1 }}>
        <Box sx={{ px: 0.5, pb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Friends</Typography>
        </Box>
        <List sx={{ width: "100%", bgcolor: "background.paper", p: 0 }}>
          {friends.map((friend) => (
            <ListItem
              key={friend.friendId}
              alignItems="flex-start"
              sx={{
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                px: 1,
                py: 1.25,
                '&:last-child': { borderBottom: "none" },
              }}
            >
              <ListItemButton onClick={() => handleUserClick(friend)}>
                <ListItemAvatar>
                  <Avatar src={friend.avatar} alt={friend.userName} sx={{ width: 40, height: 40 }}>
                    {friend.userName?.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={friend.userName}
                  secondary={friend.email}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <ProfileModal
        open={profileOpen}
        onClose={handleCloseProfile}
        user={selectedUser}
        showRemoveFriendButton={true}
      />
    </>
  );
}
