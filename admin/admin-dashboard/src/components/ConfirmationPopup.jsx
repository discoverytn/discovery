import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const ConfirmationPopup = ({ action, onConfirm, onCancel }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <div>
      <Button
        onClick={handleOpen}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        {action}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="rounded-lg shadow-xl"
      >
        <DialogTitle id="alert-dialog-title" className="bg-gray-100 text-gray-800">
          {"Confirmation"}
        </DialogTitle>
        <DialogContent className="mt-4">
          <DialogContentText id="alert-dialog-description" className="text-gray-600">
            Are you sure you want to {action.toLowerCase()}?
          </DialogContentText>
        </DialogContent>
        <DialogActions className="bg-gray-100 p-4">
          <Button
            onClick={handleClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmationPopup;