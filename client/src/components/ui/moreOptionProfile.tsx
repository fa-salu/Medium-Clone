import { useState } from "react";
import { Popover } from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";
import Link from "next/link";

interface MoreOptionsPopoverProps {
  onDelete: () => void;
  onEdit: () => void;
}

export default function MoreOptionsPopover({
  onEdit,
  onDelete,
}: MoreOptionsPopoverProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget as unknown as HTMLElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <MoreHoriz className="cursor-pointer" onClick={handleClick} />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className="bg-white shadow-lg rounded-md border border-gray-200">
          <Link href={"/new-story"}>
            <button
              type="button"
              onClick={() => {
                onEdit();
                handleClose();
              }}
              className="w-full text-center py-3 text-gray-700 hover:bg-gray-100 rounded-t-md"
            >
              Edit Story
            </button>
          </Link>
          <button
            type="button"
            onClick={() => {
              onDelete();
              handleClose();
            }}
            className="w-full text-center py-3 text-red-500 hover:bg-red-100 rounded-b-md"
          >
            Delete Story
          </button>
        </div>
      </Popover>
    </div>
  );
}
