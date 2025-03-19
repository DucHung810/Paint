"use client";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";

export default function ConfirmDeleteDialog({
  onDelete,
}: {
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    onDelete();
    handleClose();
  };

  return (
    <>
      <IconButton
        aria-label="delete"
        onClick={handleOpen}
        sx={{
          backgroundColor: "red",
          width: "10px",
          height: "10px",
          fontSize: "10px",
          "&.MuiButtonBase-root:hover": {
            backgroundColor: "red   ",
            color: "white",
          },
        }}
      >
        x
      </IconButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirm} color="error" autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
