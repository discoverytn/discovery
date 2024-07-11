import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { styled } from '@mui/system';

const RedButton = styled(Button)`
  box-shadow: inset 0px 1px 0px 0px #f5978e;
  background: linear-gradient(to bottom, #f24537 5%, #c62d1f 100%);
  background-color: #f24537;
  border-radius: 6px;
  border: 1px solid #d02718;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-family: Arial;
  font-size: 15px;
  font-weight: bold;
  padding: 6px 24px;
  text-decoration: none;
  text-shadow: 0px 1px 0px #810e05;

  &:hover {
    background: linear-gradient(to bottom, #c62d1f 5%, #f24537 100%);
    background-color: #c62d1f;
  }

  &:active {
    position: relative;
    top: 1px;
  }
`;

const GreenButton = styled(Button)`
  box-shadow: inset 0px 1px 0px 0px #a4e271;
  background: linear-gradient(to bottom, #89c403 5%, #77a809 100%);
  background-color: #89c403;
  border-radius: 6px;
  border: 1px solid #74b807;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-family: Arial;
  font-size: 15px;
  font-weight: bold;
  padding: 6px 24px;
  text-decoration: none;
  text-shadow: 0px 1px 0px #528009;

  &:hover {
    background: linear-gradient(to bottom, #77a809 5%, #89c403 100%);
    background-color: #77a809;
  }

  &:active {
    position: relative;
    top: 1px;
  }
`;

const ConfirmationPopup = ({ action, onConfirm, onCancel, CustomButton }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  const TriggerButton = CustomButton || Button;

  return (
    <div>
      <TriggerButton
        onClick={handleOpen}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        {action}
      </TriggerButton>
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

export const ApproveButton = ({ onConfirm }) => (
  <ConfirmationPopup
    action="Accept"
    onConfirm={onConfirm}
    CustomButton={({ onClick, children }) => (
      <GreenButton onClick={onClick}>
        {children}
      </GreenButton>
    )}
  />
);

export const DeclineButton = ({ onConfirm }) => (
  <ConfirmationPopup
    action="Decline"
    onConfirm={onConfirm}
    CustomButton={({ onClick, children }) => (
      <RedButton onClick={onClick}>
        {children}
      </RedButton>
    )}
  />
);

export default ConfirmationPopup;
