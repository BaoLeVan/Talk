import { Box, Button, Card, CardActions, Divider, InputAdornment, Tab, Tabs, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { EmailOutlined, LockOutlined, PersonOutlined } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useForm } from "react-hook-form"
import { FIELD_REQUIRED_MESSAGE, EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE, PASSWORD_CONFIRMATION_MESSAGE } from '~/utils/validators';
import FieldErrorAlert from '~/components/Form/FieldErrorAlert';
import { useNavigate } from 'react-router';
import { registerUser } from '~/apis';
import { toast } from 'react-toastify';

function Register() {
  const [value, setValue] = useState("Register");
  const navigate = useNavigate();

  useEffect(() => {
    if (value === "Login") {
      navigate("/login");
    } else {
      navigate("/register");
    }
  }, [value])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = (type) => {
    if (type === 'password') {
      setShowPassword((show) => !show);
    } else {
      setShowConfirmPassword((show) => !show);
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const result = await registerUser(data);
      if(result) {
        navigate("/verify-otp", { state: { email: data.email } });
      }
    } catch (error) {
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
    }
  }
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

        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '12px',
            minHeight: '40px',
            mb: 4,
            '& .MuiTabs-indicator': { display: 'none' }
          }}
        >
          <Tab label="Login" value="Login" sx={{
            color: 'white',
            textTransform: 'none',
            borderRadius: '10px',
            m: '4px',
            minHeight: '32px',
            '&.Mui-selected': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white'
            }
          }} />
          <Tab label="Register" value="Register" sx={{
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'none',
            borderRadius: '10px',
            m: '4px',
            minHeight: '32px',
            '&.Mui-selected': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white'
            }
          }} />
        </Tabs>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box >
            <TextField
              fullWidth
              placeholder='User Name'
              variant="outlined"
              error={!!errors['userName']}
              {...register("userName", {
                required: FIELD_REQUIRED_MESSAGE,
                minLength: {
                  value: 6,
                  message: 'User name must be at least 6 characters'
                },
                maxLength: {
                  value: 20,
                  message: 'User name must be at most 20 characters'
                }
              })}
              slotProps={{
                input: {
                  startAdornment: <PersonOutlined sx={{ color: 'rgba(255,255,255,0.4)', mr: 1 }} />,
                  sx: {
                    borderRadius: '12px',
                    color: 'white',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    '& fieldset': { border: 'none' }
                  }
                }
              }}
            />
            <FieldErrorAlert error={errors} fieldName={'userName'} />
          </Box>
          <Box >
            <TextField
              fullWidth
              placeholder='Email Address'
              variant="outlined"
              error={!!errors['email']}
              {...register("email", {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: EMAIL_RULE,
                  message: EMAIL_RULE_MESSAGE
                }
              })}
              slotProps={{
                input: {
                  startAdornment: <EmailOutlined sx={{ color: 'rgba(255,255,255,0.4)', mr: 1 }} />,
                  sx: {
                    borderRadius: '12px',
                    color: 'white',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    '& fieldset': { border: 'none' }
                  }
                }
              }}
            />
            <FieldErrorAlert error={errors} fieldName={'email'} />
          </Box>
          <Box >
            <TextField
              fullWidth
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              error={!!errors['password']}
              {...register("password", {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: PASSWORD_RULE,
                  message: PASSWORD_RULE_MESSAGE
                }
              })}
              slotProps={{
                input: {
                  startAdornment: <LockOutlined sx={{ color: 'rgba(255,255,255,0.4)', mr: 1 }} />,
                  sx: {
                    borderRadius: '12px',
                    color: 'white',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    '& fieldset': { border: 'none' }
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword ? 'hide the password' : 'display the password'
                        }
                        onClick={() => handleClickShowPassword('password')}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff sx={{ color: 'rgba(255,255,255,0.4)' }} /> : <Visibility sx={{ color: 'rgba(255,255,255,0.4)' }} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
            <FieldErrorAlert error={errors} fieldName={'password'} />
          </Box>
          <Box >
            <TextField
              fullWidth
              placeholder="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              error={!!errors['confirmPassword']}
              {...register("confirmPassword", {
                validate: (value) => {
                  if (value === watch('password')) return true
                  return PASSWORD_CONFIRMATION_MESSAGE
                }
              })}
              slotProps={{
                input: {
                  startAdornment: <LockOutlined sx={{ color: 'rgba(255,255,255,0.4)', mr: 1 }} />,
                  sx: {
                    borderRadius: '12px',
                    color: 'white',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    '& fieldset': { border: 'none' }
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showConfirmPassword ? 'hide the password' : 'display the password'
                        }
                        onClick={() => handleClickShowPassword('confirmPassword')}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff sx={{ color: 'rgba(255,255,255,0.4)' }} /> : <Visibility sx={{ color: 'rgba(255,255,255,0.4)' }} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
            <FieldErrorAlert error={errors} fieldName={'confirmPassword'} />
          </Box>
        </Box>
        <CardActions sx={{ mt: 2 }}>
          <Button
            fullWidth
            variant="contained"
            type='submit'
            sx={{
              mt: 4,
              py: 1.5,
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #a855f7 0%, #d946ef 100%)',
              boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
              '&:hover': { background: 'linear-gradient(90deg, #9333ea 0%, #c026d3 100%)' }
            }}
          >Register</Button>
        </CardActions>
      </Card >
    </form>
  )
}

export default Register