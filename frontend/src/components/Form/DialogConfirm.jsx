import React from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from 'react-toastify';
import { deleteUserInGroup } from '~/apis';

function DialogConfirm({ openDialog, setOpenDialog, userDelete, conversationId }) {

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleDelete = () => {
        const deleteUser = async () => {
            const result = await deleteUserInGroup(conversationId, userDelete?.userId);
            if (result) {
                toast.success(result.message);
            }
            setOpenDialog(false);
        }
        deleteUser();
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
                    {userDelete?.userName + ` do you want to delete this user from this group?`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This action will permanently delete the user from this group.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default DialogConfirm