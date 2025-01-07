"use client";

import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import Image from "next/image";
import { useAppDispatch } from "@/lib/hooks";
import { uploadImage } from "@/lib/features/uploadSlice"; // Import the uploadImage action
import { useAppSelector } from "@/lib/hooks"; // Import selector to check image upload status

interface ProfileDetails {
  name: string;
  email: string;
  bio: string;
  imageUri: string;
}

interface EditProfileDialogProps {
  open: boolean;
  profile: ProfileDetails;
  onClose: () => void;
  onSave: (updatedProfile: ProfileDetails) => void;
}

export default function EditProfileDialog({
  open,
  profile,
  onClose,
  onSave,
}: EditProfileDialogProps) {
  const dispatch = useAppDispatch();
  const { url, isLoading } = useAppSelector((state) => state.upload); // Access the upload state

  const [tempProfile, setTempProfile] = React.useState<ProfileDetails>({
    name: profile?.name || "",
    email: profile?.email || "",
    bio: profile?.bio || "",
    imageUri: profile?.imageUri || "",
  });

  React.useEffect(() => {
    setTempProfile({
      name: profile?.name || "",
      email: profile?.email || "",
      bio: profile?.bio || "",
      imageUri: profile?.imageUri || "",
    });
  }, [profile]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(uploadImage(file));
    }
  };

  React.useEffect(() => {
    if (url) {
      setTempProfile((prev) => ({ ...prev, imageUri: url }));
    }
  }, [url]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <div className="flex justify-center mb-4">
          <div className="relative">
            {tempProfile.imageUri && (
              <Image
                src={tempProfile.imageUri}
                alt="Profile"
                width={100}
                height={100}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 cursor-pointer"
                onClick={() => document.getElementById("file-input")?.click()}
              />
            )}
            <input
              id="file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          value={tempProfile.name}
          onChange={(e) =>
            setTempProfile({ ...tempProfile, name: e.target.value })
          }
          className="mb-4"
        />
        <TextField
          fullWidth
          label="Bio"
          variant="outlined"
          value={tempProfile.bio}
          onChange={(e) =>
            setTempProfile({ ...tempProfile, bio: e.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={() => onSave(tempProfile)}
          color="primary"
          disabled={isLoading}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
