import React from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function DialogConfirm({ openDialog, setOpenDialog, title, description, handleFunction}) {

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleFunctionConfirm = () => {
        handleFunction();
        setOpenDialog(false);
    }

    return (
        <React.Fragment>
            <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                role="alertdialog"
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {description}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={handleFunctionConfirm}>Delete</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default DialogConfirm