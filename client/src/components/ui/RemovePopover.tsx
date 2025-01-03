import { Popover, MenuItem } from "@mui/material";

interface PopoverMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onRemove: (storyId: string, collectionName: string) => void;
  storyId: string;
  collectionName: string;
}

const PopoverMenu = ({
  anchorEl,
  open,
  onClose,
  onRemove,
  storyId,
  collectionName,
}: PopoverMenuProps) => {
  const handleRemoveClick = () => {
    onRemove(storyId, collectionName);
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <MenuItem onClick={handleRemoveClick}>Remove</MenuItem>
    </Popover>
  );
};

export default PopoverMenu;
