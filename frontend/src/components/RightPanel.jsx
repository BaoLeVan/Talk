import {
    Avatar,
    Box,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Badge,
    Switch,
    Button,
    IconButton,
    ListItemButton,
    Tabs,
    Tab,
    ImageList,
    ImageListItem,
    CircularProgress,
    Dialog,
} from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ShieldIcon from '@mui/icons-material/Shield';
import { styled } from '@mui/material/styles';
import { Close, EmailOutlined } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DialogConfirm from './Form/DialogConfirm';
import DialogAddMembers from './Form/DialogAddMembers';
import { useUser } from './context/UserContext';
import { TYPE } from '~/utils/constants';
import { deleteGroupConversation, getConversationMedia } from '~/apis';
import { toast } from 'react-toastify';
import { useChatStore } from '~/store/useChatStore';
import { useStomp } from '~/components/context/StompContext';

function RightPanel({ conversation, onDeleteConversation }) {
    const [userDelete, setUserDelete] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [openDeleteGroupDialog, setOpenDeleteGroupDialog] = useState(false);
    const [openLeaveGroupDialog, setOpenLeaveGroupDialog] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [mediaItems, setMediaItems] = useState([]);
    const [mediaCursor, setMediaCursor] = useState(null);
    const [mediaHasNext, setMediaHasNext] = useState(false);
    const [mediaLoading, setMediaLoading] = useState(false);
    const [mediaLoadingMore, setMediaLoadingMore] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const mediaLoadingRef = useRef(false);

    const { user } = useUser();
    const { members } = useChatStore();
    const { sendMessage } = useStomp();

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    }

    const handleDelete = (targetUser) => {
        setOpenDialog(true)
        setUserDelete(targetUser)
    }

    const deleteUser = (userDeleteId, userDeleteName, conversationId) => {
        sendMessage(`/app/chat.deleteUser`, {
            conversationId,
            userId: user?.id,
            userTargetIds: [userDeleteId],
            userTargetNames: [userDeleteName]
        })
    }

    const leaveGroup = (conversationId) => {
        sendMessage(`/app/chat.leaveGroup`, {
            conversationId,
            userId: user?.id
        })
    }

    const handleDeleteGroup = async () => {
        try {
            const result = await deleteGroupConversation(conversation?.conversationId);
            toast.success(result?.message || 'Delete group successfully');
            onDeleteConversation?.(conversation?.conversationId);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Delete group failed');
        }
    }

    const handleAddMembers = (selectedUsers) => {
        const userTargetIds = selectedUsers.map(u => u.id);
        const userTargetNames = selectedUsers.map(u => u.userName);

        sendMessage(`/app/chat.addUser`, {
            conversationId: conversation?.conversationId,
            userId: user?.id,
            userTargetIds,
            userTargetNames
        });
    }

    const loadMedia = useCallback(async ({ cursor = null, append = false } = {}) => {
        if (!conversation?.conversationId || mediaLoadingRef.current) return;

        mediaLoadingRef.current = true;
        if (append) setMediaLoadingMore(true);
        else setMediaLoading(true);

        try {
            const result = await getConversationMedia({
                conversationId: conversation.conversationId,
                cursor,
                size: 20,
            });

            const items = result?.data?.items || [];
            setMediaItems(prev => append ? [...prev, ...items] : items);
            setMediaCursor(result?.data?.nextCursor || null);
            setMediaHasNext(Boolean(result?.data?.hasNext));
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Load media failed');
        } finally {
            mediaLoadingRef.current = false;
            setMediaLoading(false);
            setMediaLoadingMore(false);
        }
    }, [conversation?.conversationId]);

    useEffect(() => {
        setActiveTab(0);
        setMediaItems([]);
        setMediaCursor(null);
        setMediaHasNext(false);
        setMediaLoading(false);
        setMediaLoadingMore(false);
        mediaLoadingRef.current = false;
        setPreviewImage(null);
    }, [conversation?.conversationId]);

    useEffect(() => {
        if (activeTab !== 1 || !conversation?.conversationId) return;
        loadMedia({ cursor: null, append: false });
    }, [activeTab, conversation?.conversationId, loadMedia]);

    const handleMediaScroll = useCallback((event) => {
        const element = event.currentTarget;
        const nearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 120;
        if (nearBottom && mediaHasNext && mediaCursor && !mediaLoadingRef.current) {
            loadMedia({ cursor: mediaCursor, append: true });
        }
    }, [loadMedia, mediaCursor, mediaHasNext]);

    const SwitchCustom = styled((props) => (
        <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
    ))(({ theme }) => ({
        width: 42,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
                transform: 'translateX(16px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    backgroundColor: '#65C466',
                    opacity: 1,
                    border: 0,
                    ...theme.applyStyles('dark', {
                        backgroundColor: '#2ECA45',
                    }),
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: 0.5,
                },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: '#33cf4d',
                border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
                color: theme.palette.grey[100],
                ...theme.applyStyles('dark', {
                    color: theme.palette.grey[600],
                }),
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.7,
                ...theme.applyStyles('dark', {
                    opacity: 0.3,
                }),
            },
        },
        '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
        },
        '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: '#E9E9EA',
            opacity: 1,
            transition: theme.transitions.create(['background-color'], {
                duration: 500,
            }),
            ...theme.applyStyles('dark', {
                backgroundColor: '#39393D',
            }),
        },
    }));

    const renderInfoTab = () => (
        <>
            {conversation.conversationType === TYPE.GROUP ?
                <List sx={{ width: '100%', height: '100%', bgcolor: 'background.paper', position: 'relative', overflow: 'auto', p: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2.5, py: 1.5 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.secondary' }}>{members.length} Members</Typography>
                        <IconButton size='small' onClick={() => setOpenAddDialog(true)} sx={{ color: 'primary.main' }}>
                            <AddCircleIcon fontSize='small' />
                        </IconButton>
                    </Box>
                    {members.map((member) => (
                        <ListItemButton
                            key={member.userId}
                            sx={{
                                px: 2,
                                py: 1,
                                mx: 1,
                                borderRadius: '8px',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                            }}
                            selected={selectedIndex === member.userId}
                            onClick={(event) => handleListItemClick(event, member.userId)}
                        >
                            <ListItem alignItems="flex-start" sx={{ p: 0 }}>
                                <ListItemAvatar>
                                    <Badge anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" color="success">
                                        <Avatar alt={member.userName} src={member.userAvatar} sx={{ width: 36, height: 36 }} />
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{member.userName}</Typography>} />
                                {user?.id !== member?.userId && member?.userRole !== 'ADMIN' && (
                                    <IconButton onClick={() => handleDelete(member)} size='small' color='error'>
                                        <Close fontSize="small" />
                                    </IconButton>
                                )}
                            </ListItem>
                        </ListItemButton>
                    ))}
                </List> :
                <Box sx={{ display: 'flex', flexDirection: 'column', px: 2.5, py: 2, gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ bgcolor: '#f0f4ff', p: 1, borderRadius: '10px' }}>
                            <EmailOutlined sx={{ color: 'primary.main', fontSize: 20 }} />
                        </Box>
                        <Box>
                            <Typography fontSize={12} color="text.secondary" sx={{ fontWeight: 500 }}>Email</Typography>
                            <Typography fontSize={13} variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>{user.email}</Typography>
                        </Box>
                    </Box>
                </Box>
            }
        </>
    );

    const renderMediaTab = () => (
        <Box
            onScroll={handleMediaScroll}
            sx={{
                height: '100%',
                overflowY: 'auto',
                px: 1.5,
                py: 1.5,
            }}
        >
            {mediaLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={28} />
                </Box>
            ) : mediaItems?.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, px: 2 }}>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        Chua co hinh anh nao trong cuoc tro chuyen nay
                    </Typography>
                </Box>
            ) : (
                <ImageList variant="masonry" cols={3} gap={8}>
                    {mediaItems?.map((item, index) => (
                        <ImageListItem
                            key={`${item.messageId || 'msg'}-${item.url || index}-${item.createdAt || index}`}
                            sx={{
                                overflow: 'hidden',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                '& img': {
                                    transition: 'transform 0.2s ease',
                                },
                                '&:hover img': {
                                    transform: 'scale(1.03)',
                                }
                            }}
                            onClick={() => setPreviewImage(item)}
                        >
                            <img
                                src={item.url}
                                alt={item.fileName || `media-${index}`}
                                loading="lazy"
                                style={{ width: '100%', display: 'block' }}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            )}

            {mediaLoadingMore && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} />
                </Box>
            )}
        </Box>
    );

    return (
        <>
            <Paper elevation={0} sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: 0,
                bgcolor: 'background.paper'
            }}>
                <Box sx={{
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                    flexShrink: 0,
                    px: 2.5,
                    py: 2
                }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.primary' }}>Contact Info</Typography>
                </Box>
                {conversation.conversationType === TYPE.GROUP ?
                    <Box sx={{
                        px: 3,
                        py: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                        flexShrink: 0,
                        gap: 1
                    }}>
                        <Avatar src={conversation?.avatar} sx={{ width: 80, height: 80, boxShadow: '0 4px 14px rgba(0,0,0,0.12)' }} />
                        <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: 'text.primary' }}>
                            {conversation?.conversationTitle}
                        </Typography>
                    </Box>
                    : <Box sx={{
                        px: 3,
                        py: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                        flexShrink: 0,
                        gap: 1
                    }}>
                        <Avatar src={conversation?.userAvatar} sx={{ width: 80, height: 80, boxShadow: '0 4px 14px rgba(0,0,0,0.12)' }} />
                        <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: 'text.primary' }}>
                            {conversation?.userName}
                        </Typography>
                    </Box>
                }

                <Box sx={{ borderBottom: '1px solid rgba(0,0,0,0.06)', flexShrink: 0 }}>
                    <Tabs
                        value={activeTab}
                        onChange={(_, newValue) => setActiveTab(newValue)}
                        variant="fullWidth"
                        sx={{ minHeight: 44 }}
                    >
                        <Tab label="Info" sx={{ minHeight: 44, textTransform: 'none', fontWeight: 600 }} />
                        <Tab label="Media" sx={{ minHeight: 44, textTransform: 'none', fontWeight: 600 }} />
                    </Tabs>
                </Box>

                <Box sx={{ borderBottom: '1px solid rgba(0,0,0,0.06)', flexGrow: 1, overflow: 'hidden' }}>
                    {activeTab === 0 ? renderInfoTab() : renderMediaTab()}
                </Box>
                <Box sx={{ borderBottom: '1px solid rgba(0,0,0,0.06)', flexShrink: 0, px: 2.5, py: 1.5 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.secondary', mb: 1 }}>Settings</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <NotificationsNoneIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>Notifications</Typography>
                        </Box>
                        <SwitchCustom />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ShieldIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>Block User</Typography>
                        </Box>
                        <SwitchCustom />
                    </Box>
                </Box>
                {conversation.conversationType === TYPE.GROUP ? (
                    <Box sx={{ display: 'flex', px: 2, py: 2, gap: 1, flexShrink: 0 }}>
                        <Button fullWidth variant="outlined" color='error'
                            sx={{ borderRadius: '10px', fontWeight: 600, textTransform: 'none' }}
                            onClick={() => setOpenLeaveGroupDialog(true)}>
                            Leave Group
                        </Button>
                        <Button fullWidth variant="outlined" color='error'
                            onClick={() => setOpenDeleteGroupDialog(true)}
                            sx={{ borderRadius: '10px', fontWeight: 600, textTransform: 'none' }}>
                            Delete Group
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ px: 2, py: 2, flexShrink: 0 }}>
                        <Button fullWidth variant="outlined" color='error'
                            sx={{ borderRadius: '10px', fontWeight: 600, textTransform: 'none' }}>
                            Delete Chat
                        </Button>
                    </Box>
                )}
            </Paper>
            <DialogConfirm
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                title={`Delete User ${userDelete?.userName}`}
                description={`Are you sure you want to delete ${userDelete?.userName}?`}
                handleFunction={() => deleteUser(userDelete?.userId, userDelete?.userName, conversation?.conversationId)}
            />
            <DialogAddMembers
                openDialog={openAddDialog}
                setOpenDialog={setOpenAddDialog}
                members={members}
                onAdd={handleAddMembers}
            />
            <DialogConfirm
                openDialog={openLeaveGroupDialog}
                setOpenDialog={setOpenLeaveGroupDialog}
                title={`Leave Group ${conversation?.conversationTitle}`}
                description={`Are you sure you want to leave ${conversation?.conversationTitle}?`}
                handleFunction={() => leaveGroup(conversation?.conversationId)}
            />
            <DialogConfirm
                openDialog={openDeleteGroupDialog}
                setOpenDialog={setOpenDeleteGroupDialog}
                title={`Delete Group ${conversation?.conversationTitle}`}
                description={`Are you sure you want to delete ${conversation?.conversationTitle}?`}
                handleFunction={handleDeleteGroup}
            />
            <Dialog open={Boolean(previewImage)} onClose={() => setPreviewImage(null)} maxWidth="lg">
                {previewImage && (
                    <Box sx={{ bgcolor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                            src={previewImage.url}
                            alt={previewImage.fileName || 'preview'}
                            style={{ maxWidth: '90vw', maxHeight: '90vh', display: 'block' }}
                        />
                    </Box>
                )}
            </Dialog>
        </>
    )
}

export default RightPanel