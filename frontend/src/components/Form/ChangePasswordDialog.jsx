import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import FieldErrorAlert from './FieldErrorAlert';
import {
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
} from '~/utils/validators';

function ChangePasswordDialog({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  showCurrentPassword,
  setShowCurrentPassword,
  showNewPassword,
  setShowNewPassword,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data) => {
    await onSubmit(data, reset);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(15, 23, 42, 0.18)',
        }
      }}
    >
      <DialogTitle sx={{ px: 3, pt: 3, pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '20px' }}>
              Change Password
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: '13px', color: 'text.secondary' }}>
              Enter your current password and a new password.
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ px: 3, pt: 1, pb: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <TextField
                fullWidth
                type={showCurrentPassword ? 'text' : 'password'}
                label="Current Password"
                error={!!errors.currentPassword}
                {...register('currentPassword', {
                  required: FIELD_REQUIRED_MESSAGE,
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setShowCurrentPassword((prev) => !prev)}>
                        {showCurrentPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <FieldErrorAlert error={errors} fieldName={'currentPassword'} />
            </Box>

            <Box>
              <TextField
                fullWidth
                type={showNewPassword ? 'text' : 'password'}
                label="New Password"
                error={!!errors.newPassword}
                {...register('newPassword', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE,
                  },
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setShowNewPassword((prev) => !prev)}>
                        {showNewPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <FieldErrorAlert error={errors} fieldName={'newPassword'} />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            fullWidth
            disabled={isSubmitting}
            sx={{ borderRadius: 999, textTransform: 'none', py: 1.1 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{ borderRadius: 999, textTransform: 'none', py: 1.1 }}
          >
            {isSubmitting ? 'Changing...' : 'Change Password'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ChangePasswordDialog;
