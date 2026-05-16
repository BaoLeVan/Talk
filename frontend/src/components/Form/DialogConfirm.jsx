import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CloseIcon from '@mui/icons-material/Close';
import { COLORS } from '~/utils/common';

function DialogConfirm({ openDialog, setOpenDialog, title, description, handleFunction }) {
  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleFunctionConfirm = () => {
    handleFunction();
    setOpenDialog(false);
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: 420,
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.16)'
        }
      }}
    >
      <DialogTitle sx={{ px: 3, pt: 3, pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Box sx={{ width: 46, height: 46, borderRadius: '16px', bgcolor: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <WarningAmberRoundedIcon />
            </Box>
            <Box>
              <Typography id="alert-dialog-title" sx={{ fontWeight: 800, fontSize: '18px', color: COLORS.text, letterSpacing: '-0.3px' }}>
                {title}
              </Typography>
              <Typography sx={{ mt: 0.5, fontSize: '13px', color: COLORS.textMuted }}>
                Please confirm this action.
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: COLORS.textSecondary }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 1 }}>
        <Box sx={{ p: 2, borderRadius: '18px', bgcolor: '#F8FAFC', border: '1px solid #EEF2FF' }}>
          <Typography id="alert-dialog-description" sx={{ fontSize: '14px', color: COLORS.textSecondary, lineHeight: 1.7 }}>
            {description}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          fullWidth
          sx={{ borderRadius: '999px', textTransform: 'none', py: 1.1, fontWeight: 700, borderColor: COLORS.border, color: COLORS.textSecondary }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleFunctionConfirm}
          fullWidth
          sx={{ borderRadius: '999px', textTransform: 'none', py: 1.1, fontWeight: 700, color: COLORS.white, bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' } }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogConfirm;
