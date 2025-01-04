import { useState } from "react";
import { Popover, IconButton, Button } from "@mui/material";
import MoreHoriz from "@mui/icons-material/MoreHoriz";

interface DeletePopoverProps {
  onDelete: () => void;
}

export default function DeletePopover({ onDelete }: DeletePopoverProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    onDelete();
    handleClose();
  };

  return (
    <div>
      <IconButton onClick={handleOpen}>
        <MoreHoriz />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className="p-4 space-y-2">
          <Button
            variant="text"
            color="error"
            onClick={handleDelete}
            className="text-red-600"
          >
            Delete
          </Button>
        </div>
      </Popover>
    </div>
  );
}
