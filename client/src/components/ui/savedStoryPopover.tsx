"use client";

import type React from "react";
import { useState } from "react";
import { Popover, Modal, Button, TextField } from "@mui/material";
import { BookmarkBorder } from "@mui/icons-material";

interface BookmarkPopoverProps {
  storyId: string;
  collections: string[];
  onAddToCollection: (collectionName: string) => void;
  onCreateNewCollection: (newCollectionName: string, storyId: string) => void;
}

export default function BookmarkPopover({
  storyId,

  collections,
  onAddToCollection,
  onCreateNewCollection,
}: BookmarkPopoverProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    handleClose();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewCollectionName("");
  };

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      onCreateNewCollection(newCollectionName.trim(), storyId);
      handleCloseModal();
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <button type="button" onClick={handleOpen} className="cursor-pointer">
        <BookmarkBorder />
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
          <p className="text-lg font-semibold">Collections</p>
          {collections?.length > 0 ? (
            collections.map((collection) => (
              <button
                type="button"
                key={collection}
                onClick={() => onAddToCollection(collection)}
                className="w-full text-left p-2 hover:bg-gray-100 rounded"
              >
                {collection}
              </button>
            ))
          ) : (
            <p className="text-gray-500">No collections available.</p>
          )}
          <button
            type="button"
            onClick={handleOpenModal}
            className="w-full p-2 text-left bg-gray-100 rounded hover:bg-gray-200"
          >
            + Create New Collection
          </button>
        </div>
      </Popover>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg space-y-4">
            <h2 className="text-lg font-semibold">Create New Collection</h2>
            <TextField
              fullWidth
              label="Collection Name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <Button onClick={handleCloseModal} variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={handleCreateCollection}
                variant="contained"
                color="primary"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
