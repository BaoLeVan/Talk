import {
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import { useFriendStore } from "~/store/useFriendStore";
import { useEffect, useState } from "react";
import ProfileModal from "./Toast/ProfileModal";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { COLORS } from "~/utils/common";
import { searchUsers } from "~/apis";
import useDebounce from "~/hooks/useDebounce";
import { useUser } from "./context/UserContext";
import { useStomp } from "~/components/context/StompContext";

export default function FriendsList() {
  const { friends, fetchFriends, loading, sendFriendRequestAction } = useFriendStore();
  const { user: currentUser } = useUser();
  const { sendMessage } = useStomp();

  const [selectedUser, setSelectedUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [users, setUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sendingUserId, setSendingUserId] = useState(null);
  const debouncedKeyword = useDebounce(keyword, 500);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  useEffect(() => {
    if (!addFriendOpen || !debouncedKeyword.trim()) {
      setUsers([]);
      return;
    }

    let ignore = false;
    setSearchLoading(true);

    searchUsers(debouncedKeyword)
      .then((response) => {
        if (ignore) return;
        const friendIds = new Set(friends.map((friend) => friend.friendId || friend.id));
        const usersList = response?.data || [];
        setUsers(usersList.filter((user) => user.id !== currentUser?.id && !friendIds.has(user.id)));
      })
      .catch((err) => {
        console.error('Search users failed', err);
        if (!ignore) setUsers([]);
      })
      .finally(() => {
        if (!ignore) setSearchLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [addFriendOpen, debouncedKeyword, currentUser?.id, friends]);

  const handleUserClick = (friend) => {
    setSelectedUser(friend);
    setProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setProfileOpen(false);
    setSelectedUser(null);
  };

  const handleSendFriendRequest = async (receiverId) => {
    if (sendingUserId) return;
    setSendingUserId(receiverId);
    try {
      sendFriendRequestAction(sendMessage)(receiverId, '');
    } finally {
      setSendingUserId(null);
    }
  };

  const renderFriendItem = (friend) => (
    <ListItemButton
      key={friend.friendId || friend.id}
      onClick={() => handleUserClick(friend)}
      sx={{
        mx: 1,
        mb: 0.75,
        px: 1.5,
        py: 1.25,
        borderRadius: '18px',
        transition: 'all 0.2s ease',
        '&:hover': { bgcolor: COLORS.primaryHover, transform: 'translateX(2px)' }
      }}
    >
      <ListItemAvatar sx={{ minWidth: 52 }}>
        <Badge anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" color="success">
          <Avatar src={friend.avatar} alt={friend.userName} sx={{ width: 44, height: 44, boxShadow: '0 8px 18px rgba(0,0,0,0.08)' }}>
            {friend.userName?.charAt(0).toUpperCase()}
          </Avatar>
        </Badge>
      </ListItemAvatar>
      <ListItemText
        primary={<Typography sx={{ fontWeight: 700, color: COLORS.text, fontSize: '15px' }}>{friend.userName}</Typography>}
        secondary={<Typography sx={{ color: COLORS.textMuted, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{friend.email}</Typography>}
      />
    </ListItemButton>
  );

  const renderSearchUserItem = (user) => (
    <ListItemButton
      key={user.id}
      sx={{
        mx: 1,
        mb: 0.75,
        px: 1.5,
        py: 1.25,
        borderRadius: '18px',
        '&:hover': { bgcolor: '#F8F9FF' }
      }}
    >
      <ListItemAvatar sx={{ minWidth: 52 }}>
        <Avatar src={user.avatar} alt={user.userName} sx={{ width: 44, height: 44 }}>
          {user.userName?.charAt(0).toUpperCase()}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={<Typography sx={{ fontWeight: 700, color: COLORS.text, fontSize: '15px' }}>{user.userName}</Typography>}
        secondary={<Typography sx={{ color: COLORS.textMuted, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</Typography>}
      />
      <Button
        variant="contained"
        size="small"
        disabled={sendingUserId === user.id}
        onClick={(e) => {
          e.stopPropagation();
          handleSendFriendRequest(user.id);
        }}
        startIcon={<PersonAddAlt1Icon sx={{ fontSize: 16 }} />}
        sx={{
          borderRadius: '999px',
          textTransform: 'none',
          minWidth: 86,
          boxShadow: 'none',
          background: 'linear-gradient(135deg, #6EA8FE 0%, #5B67FF 55%, #7C5CFF 100%)'
        }}
      >
        {sendingUserId === user.id ? 'Sending' : 'Add'}
      </Button>
    </ListItemButton>
  );

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxHeight: '78vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: '24px',
          bgcolor: '#FFFFFF'
        }}
      >
        <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5, background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FF 100%)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Box sx={{ width: 42, height: 42, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: COLORS.primaryLight, color: COLORS.primary }}>
                <PeopleAltOutlinedIcon />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '20px', color: COLORS.text, letterSpacing: '-0.4px' }}>Friends</Typography>
                <Typography sx={{ fontSize: '13px', color: COLORS.textMuted }}>{friends.length} friends in your chat network</Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={() => setAddFriendOpen((prev) => !prev)}
              sx={{
                width: 40,
                height: 40,
                borderRadius: '14px',
                color: addFriendOpen ? COLORS.white : COLORS.primary,
                bgcolor: addFriendOpen ? COLORS.primary : COLORS.primaryLight,
                '&:hover': { bgcolor: addFriendOpen ? COLORS.primary : COLORS.primaryHover }
              }}
            >
              {addFriendOpen ? <CloseIcon fontSize="small" /> : <AddCircleOutlineIcon fontSize="small" />}
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ flex: 1, minHeight: 220, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' }, py: 1 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress size={28} sx={{ color: COLORS.primary }} />
            </Box>
          ) : friends.length > 0 ? (
            <List sx={{ p: 0 }}>{friends.map(renderFriendItem)}</List>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 700, color: COLORS.text, mb: 0.75 }}>No friends yet</Typography>
              <Typography sx={{ color: COLORS.textMuted, fontSize: '14px' }}>Click the + button to find and add your first friend.</Typography>
            </Box>
          )}
        </Box>

        <Collapse in={addFriendOpen} timeout="auto" unmountOnExit>
          <Divider />
          <Box sx={{ p: 2, bgcolor: '#F8F9FF' }}>
            <Typography sx={{ fontWeight: 800, fontSize: '15px', color: COLORS.text, mb: 1.25 }}>Add friend</Typography>
            <TextField
              fullWidth
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by username or email"
              size="small"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: COLORS.textMuted }} />
                  </InputAdornment>
                ),
                sx: {
                  height: 48,
                  borderRadius: '16px',
                  bgcolor: COLORS.white,
                  '& fieldset': { border: 'none' },
                  '&.Mui-focused': { boxShadow: `0 0 0 2px ${COLORS.primary}22` }
                }
              }}
            />

            <Box sx={{ maxHeight: 260, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': { display: 'none' }, mt: 1.25 }}>
              {searchLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress size={24} sx={{ color: COLORS.primary }} />
                </Box>
              ) : users.length > 0 ? (
                <List sx={{ p: 0 }}>{users.map(renderSearchUserItem)}</List>
              ) : (
                <Typography sx={{ textAlign: 'center', py: 3, color: COLORS.textMuted, fontSize: '13px' }}>
                  {debouncedKeyword ? 'No users found.' : 'Type a name or email to search users.'}
                </Typography>
              )}
            </Box>
          </Box>
        </Collapse>
      </Paper>

      <ProfileModal
        open={profileOpen}
        onClose={handleCloseProfile}
        user={selectedUser}
        showRemoveFriendButton={true}
      />
    </>
  );
}
