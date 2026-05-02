import React from 'react'
import { useLocation } from 'react-router'
import Login from './Login';
import Register from './Register';
import VerifyOtp from './VerifyOtp';
import { Box } from '@mui/material';

function Auth() {
    const location = useLocation();

    const isLogin = location.pathname === "/login";
    const isRegister = location.pathname === "/register";
    const isVerifyOtp = location.pathname === "/verify-otp";

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
            {isVerifyOtp && <VerifyOtp />}
        </Box>
    )
}

export default Auth