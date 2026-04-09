import React from 'react'
import { useLocation } from 'react-router'
import Login from './Login';
import Register from './Register';
import { Box } from '@mui/material';

function Auth() {
    const location = useLocation();

    const isLogin = location.pathname === "/login";
    const isRegister = location.pathname === "/register";

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                background: 'radial-gradient(circle at center, #24133d 0%, #0d0617 100%)',
                p: 2
            }}>
            {isLogin && <Login />}
            {isRegister && <Register />}
        </Box>
    )
}

export default Auth