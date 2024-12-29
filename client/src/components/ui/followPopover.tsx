import type React from "react";
import { useState } from "react";
import { Popover, Button } from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";

interface FollowPopoverProps {
  authorName: string;
  onFollow: () => void;
}

export default function FollowPopover({
  authorName,
  onFollow,
}: FollowPopoverProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <button type="button" onClick={handleOpen} className="cursor-pointer">
        <MoreHoriz />
      </button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div className="p-4 space-y-2">
          <button
            type="button"
            onClick={() => {
              onFollow();
              handleClose();
            }}
          >
            Follow {authorName}
          </button>
        </div>
      </Popover>
    </div>
  );
}
