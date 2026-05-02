import { Box, Button, Card, CardActions, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { MarkEmailRead } from '@mui/icons-material';
import { useForm } from "react-hook-form";
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators';
import FieldErrorAlert from '~/components/Form/FieldErrorAlert';
import { useNavigate, useLocation } from 'react-router';
import { verifyOtp, resendOtp } from '~/apis';
import { toast } from 'react-toastify';

function VerifyOtp() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [isResending, setIsResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // Redirect nếu không có email
    React.useEffect(() => {
        if (!email) {
            toast.error("Email không hợp lệ. Vui lòng đăng ký lại.");
            navigate("/register");
        }
    }, [email, navigate]);

    const onSubmit = async (data) => {
        try {
            const result = await verifyOtp({ email, otp: data.otp });
            if (result) {
                toast.success("Xác thực OTP thành công!");
                navigate("/");
            }
        } catch (error) {
            toast.error("Mã OTP không chính xác. Vui lòng thử lại.");
        }
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0) {
            toast.warning(`Vui lòng đợi ${resendCooldown}s trước khi gửi lại OTP`);
            return;
        }

        setIsResending(true);
        try {
            const result = await resendOtp({ email });
            if (result) {
                toast.success("Mã OTP mới đã được gửi đến email của bạn!");
                
                // Bắt đầu cooldown 60 giây
                setResendCooldown(60);
                const interval = setInterval(() => {
                    setResendCooldown((prev) => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        } catch (error) {
            toast.error("Không thể gửi lại OTP. Vui lòng thử lại sau.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card sx={{
                p: 4,
                borderRadius: '24px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                width: '400px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                textAlign: 'center',
                mt: '10rem'
            }}>
                <Box sx={{ mb: 4 }}>
                    <Box sx={{
                        display: 'inline-flex',
                        p: 1.5,
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                        mb: 2
                    }}>
                        <ChatBubbleIcon sx={{ color: 'white' }} />
                    </Box>
                    <Typography variant='h5' sx={{ fontWeight: 'bold', color: 'white', letterSpacing: '2px' }}>Talk</Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem', fontWeight: '600' }}>REALTIME COMMUNICATION</Typography>
                </Box>

                <Box sx={{ mb: 3, textAlign: 'center' }}>
                    <Box sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(168, 85, 247, 0.1)',
                        mb: 2
                    }}>
                        <MarkEmailRead sx={{ color: '#a855f7', fontSize: '3rem' }} />
                    </Box>
                    <Typography variant='h6' sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                        Xác thực Email
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem', px: 2 }}>
                        Chúng tôi đã gửi mã OTP đến email
                    </Typography>
                    <Typography sx={{ color: '#a855f7', fontSize: '0.875rem', fontWeight: 'bold', mt: 0.5 }}>
                        {email}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                        <TextField
                            fullWidth
                            placeholder='Nhập mã OTP'
                            variant="outlined"
                            error={!!errors['otp']}
                            {...register("otp", {
                                required: FIELD_REQUIRED_MESSAGE,
                                pattern: {
                                    value: /^[0-9]{6}$/,
                                    message: 'Mã OTP phải là 6 chữ số'
                                }
                            })}
                            slotProps={{
                                input: {
                                    sx: {
                                        borderRadius: '12px',
                                        color: 'white',
                                        backgroundColor: 'rgba(0,0,0,0.2)',
                                        textAlign: 'center',
                                        fontSize: '1.5rem',
                                        letterSpacing: '0.5rem',
                                        '& fieldset': { border: 'none' },
                                        '& input': { textAlign: 'center' }
                                    }
                                }
                            }}
                            inputProps={{
                                maxLength: 6,
                                inputMode: 'numeric',
                                pattern: '[0-9]*'
                            }}
                        />
                        <FieldErrorAlert error={errors} fieldName={'otp'} />
                    </Box>
                </Box>

                <CardActions sx={{ mt: 2, flexDirection: 'column', gap: 2 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        type='submit'
                        sx={{
                            py: 1.5,
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            background: 'linear-gradient(90deg, #a855f7 0%, #d946ef 100%)',
                            boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
                            '&:hover': { background: 'linear-gradient(90deg, #9333ea 0%, #c026d3 100%)' }
                        }}
                    >
                        Xác nhận
                    </Button>

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem', mb: 1 }}>
                            Chưa nhận được mã?
                        </Typography>
                        <Button
                            variant="text"
                            onClick={handleResendOtp}
                            disabled={isResending || resendCooldown > 0}
                            sx={{
                                color: resendCooldown > 0 ? 'rgba(255, 255, 255, 0.3)' : '#a855f7',
                                textTransform: 'none',
                                fontSize: '0.875rem',
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                                },
                                '&:disabled': {
                                    color: 'rgba(255, 255, 255, 0.3)'
                                }
                            }}
                        >
                            {resendCooldown > 0 ? `Gửi lại sau ${resendCooldown}s` : 'Gửi lại OTP'}
                        </Button>
                    </Box>
                </CardActions>
            </Card>
        </form>
    );
}

export default VerifyOtp;
