// import type React from "react";
// import { useState } from "react";
// import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
// import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
// import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// import CodeIcon from "@mui/icons-material/Code";
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import { useAppDispatch } from "@/lib/hooks";
// import { uploadImage } from "@/lib/features/uploadSlice";

// export default function IconSet() {
//   const [showImageUpload, setShowImageUpload] = useState(false);
//   const dispatch = useAppDispatch();

//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       dispatch(uploadImage(file)) // Dispatch the uploadImage action
//         .then(() => {
//           setShowImageUpload(false); // Close the input section after the upload
//         })
//         .catch((error) => {
//           console.error("Error uploading image:", error);
//         });
//     }
//   };

//   return (
//     <div className="absolute right-40 top-20 flex space-x-2 bg-white shadow-md p-4">
//       <AddPhotoAlternateIcon onClick={() => setShowImageUpload(true)} />
//       {showImageUpload && (
//         <input
//           type="file"
//           onChange={handleImageUpload}
//           className="border p-2"
//         />
//       )}
//       <VideoLibraryIcon />
//       <InsertDriveFileIcon />
//       <CodeIcon />
//       <MoreHorizIcon />
//     </div>
//   );
// }

import type React from "react";
import { useEffect, useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CodeIcon from "@mui/icons-material/Code";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { uploadImage } from "@/lib/features/uploadSlice";

export default function IconSet({
  storyRef,
}: {
  storyRef: React.RefObject<HTMLDivElement>;
}) {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const dispatch = useAppDispatch();
  const imageUrl = useAppSelector((state) => state.upload.url); // Get image URL from Redux state

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(uploadImage(file)) // Dispatch the uploadImage action
        .then(() => {
          setShowImageUpload(false); // Close the input section after the upload
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    }
  };

  // Insert the image URL into the editor content
  useEffect(() => {
    if (imageUrl && storyRef.current) {
      const editor = storyRef.current as HTMLDivElement;
      const imgTag = `<img src="${imageUrl}" alt="uploaded-image" />`;
      editor.innerHTML += imgTag; // Append the image to the editor content
    }
  }, [imageUrl, storyRef]);

  return (
    <div className="absolute right-40 top-20 flex space-x-2 bg-white shadow-md p-4">
      <AddPhotoAlternateIcon onClick={() => setShowImageUpload(true)} />
      {showImageUpload && (
        <input
          type="file"
          onChange={handleImageUpload}
          className="border p-2"
        />
      )}
      <VideoLibraryIcon />
      <InsertDriveFileIcon />
      <CodeIcon />
      <MoreHorizIcon />
    </div>
  );
}
