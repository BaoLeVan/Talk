import { Box, IconButton, Drawer } from '@mui/material';
import SideBar from "./components/SideBar";
import RightPanel from "./components/RightPanel";
import ChatWindow from "./components/ChatWindow";
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleRightPanelToggle = () => {
    setRightPanelOpen(!rightPanelOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 300 },
        }}
      >
        <SideBar />
      </Drawer>

      {/* Desktop Sidebar */}
      <Box sx={{ 
        width: { xs: 'none', sm: '300px', md: '360px' }, 
        display: { xs: 'none', sm: 'block' },
        flexShrink: 0,
        borderRight: '1px solid #e0e0e0'
      }}>
        <SideBar />
      </Box>

      {/* Chat Area */}
      <Box sx={{ 
        flexGrow: 1, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Mobile Header for hamburger menu */}
        <Box sx={{ 
          display: { xs: 'flex', lg: 'none' }, 
          alignItems: 'center', 
          p: 1, 
          borderBottom: '1px solid #e0e0e0',
          justifyContent: 'space-between',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          bgcolor: 'white'
        }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="open info"
            edge="end"
            onClick={handleRightPanelToggle}
            sx={{ display: { lg: 'none' } }}
          >
            <InfoIcon />
          </IconButton>
        </Box>
        <Box sx={{ flexGrow: 1, mt: { xs: '56px', lg: 0 } }}>
          <ChatWindow />
        </Box>
      </Box>

      {/* Mobile/Tablet Right Panel Drawer */}
      <Drawer
        anchor="right"
        variant="temporary"
        open={rightPanelOpen}
        onClose={handleRightPanelToggle}
        ModalProps={{
          keepMounted: true, 
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 300 },
        }}
      >
        <RightPanel />
      </Drawer>

      {/* Desktop Right Panel */}
      <Box sx={{ 
        width: '360px', 
        display: { xs: 'none', lg: 'block' },
        flexShrink: 0,
        borderLeft: '1px solid #e0e0e0'
      }}>
        <RightPanel />
      </Box>
    </Box>
  )
}

export default App
