import { Avatar, Badge, Box, Button, FormControl, IconButton, Input, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from '@mui/material'
import React from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { LogoutOutlined, Search } from '@mui/icons-material';

function SideBar() {
  return (
    <Paper sx={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{
        px: 2,
        py: 3,
        borderBottom: '1px solid #e0e0e0',
        flexShrink: 0
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant='h5' sx={{ fontWeight: 'bold' }}>Messages</Typography>
          <IconButton size="large">
            <AddCircleIcon fontSize='inherit' />
          </IconButton>
        </Box>
        <Box>
          <FormControl
            fullWidth
          >
            <Input
              placeholder='Search conversations...'
              sx={{
                borderRadius: '20px',
                backgroundColor: 'oklch(0.967 0.003 264.542)',
                height: '40px',
                pl: 2,
                lineHeight: '1.5',
                fontSize: '1rem',
                fontWeight: '400'
              }}
              disableUnderline
              startAdornment={
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <List
          sx={{
            width: '100%',
            height: '100%',
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'auto',
          }}>
          {[...Array(10)].map((_, index) => (
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary="Brunch this weekend?"
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: 'text.primary', display: 'inline' }}
                    >
                      Random message at 9:44:52 PM
                    </Typography>
                  </React.Fragment>
                }
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant='caption' sx={{ color: 'text.secondary', mb: 1.5, mt: 1 }}>2m</Typography>
                <Badge sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.8rem',
                    height: '20px',
                    fontWeight: 'bold',
                  }
                }}
                  badgeContent={100}
                  color="primary"></Badge>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2,
        py: 2,
        borderTop: '1px solid #e0e0e0',
        flexShrink: 0
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          <Typography>User Name</Typography>
        </Box>
        <Box>
          <IconButton size="large">
            <LogoutOutlined></LogoutOutlined>
          </IconButton>
        </Box>
      </Box>
    </Paper>
  )
}

export default SideBar