import { Box, IconButton, Drawer } from '@mui/material';
import SideBar from './components/SideBar';
import RightPanel from './components/RightPanel';
import ChatWindow from './components/ChatWindow';
import { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import { useUser } from './components/context/UserContext';
import { useChatStore } from './store/useChatStore';
import useDebounce from './hooks/useDebounce';
import { getListMemberByConversationId } from './apis';
import { TYPE } from './utils/constants';

function App() {
  const [conversation, setConversation] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [searchConversation, setSearchConversation] = useState('');
  const { user } = useUser();
  const fetchConversations = useChatStore((state) => state.fetchConversations);
  const setMembers = useChatStore((state) => state.setMembers);
  const debouncedSearchConversation = useDebounce(searchConversation, 500);

  useEffect(() => {
    if (user?.id) fetchConversations(user.id, debouncedSearchConversation);
  }, [user?.id, debouncedSearchConversation, fetchConversations]);

  useEffect(() => {
    if (!conversation?.conversationId || conversation?.conversationType !== TYPE.GROUP) {
      setMembers([]);
      return;
    }

    let ignore = false;

    const fetchMembers = async () => {
      const result = await getListMemberByConversationId(conversation.conversationId);
      if (!ignore && result) setMembers(result.data);
    };

    fetchMembers();

    return () => {
      ignore = true;
    };
  }, [conversation?.conversationId, conversation?.conversationType, setMembers]);

  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      bgcolor: '#F3F5FF'
    }}>
      <Box sx={{
        width: { xs: '250px', sm: '380px', md: '420px' },
        display: { xs: 'block', sm: 'block' },
        flexShrink: 0,
        borderRight: '1px solid #EEF2FF',
        bgcolor: '#F8F9FC'
      }}>
        <SideBar selectedIndex={selectedIndex} onSelectConversation={(id) => setSelectedIndex(id)} setConversation={setConversation} searchConversation={searchConversation} setSearchConversation={setSearchConversation} />
      </Box>

      <Box sx={{
        flexGrow: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        bgcolor: '#FFFFFF'
      }}>
        <Box sx={{ flexGrow: 1, mt: { xs: '56px', lg: 0 } }}>
          <ChatWindow conversation={conversation} rightPanelOpen={rightPanelOpen} setRightPanelOpen={setRightPanelOpen} />
        </Box>
      </Box>

      {conversation && (
        <>
          <Box
            sx={{
              width: '360px',
              display: { xs: 'none', lg: rightPanelOpen ? 'none' : 'block' },
              flexShrink: 0,
              borderLeft: '1px solid #EEF2FF',
              bgcolor: '#FFFFFF'
            }}>
            <RightPanel conversation={conversation} />
          </Box>
        </>
      )}
    </Box>
  )
}

export default App
