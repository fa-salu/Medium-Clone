import React from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CodeIcon from "@mui/icons-material/Code";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

export default function IconSet() {
  return (
    <div className="absolute right-40 top-20 flex space-x-2 bg-white shadow-md p-4">
      <AddPhotoAlternateIcon />
      <VideoLibraryIcon />
      <InsertDriveFileIcon />
      <CodeIcon />
      <MoreHorizIcon />
    </div>
  );
}
