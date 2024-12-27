// import type React from "react";
// import { useEffect, useState } from "react";
// import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
// import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
// import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// import CodeIcon from "@mui/icons-material/Code";
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import { useAppDispatch, useAppSelector } from "@/lib/hooks";
// import { uploadImage } from "@/lib/features/uploadSlice";

// export default function IconSet({
//   storyRef,
// }: {
//   storyRef: React.RefObject<HTMLDivElement>;
// }) {
//   const [showImageUpload, setShowImageUpload] = useState(false);
//   const dispatch = useAppDispatch();
//   const imageUrl = useAppSelector((state) => state.upload.url);

//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       dispatch(uploadImage(file))
//         .then(() => {
//           setShowImageUpload(false);
//         })
//         .catch((error) => {
//           console.error("Error uploading image:", error);
//         });
//     }
//   };

//   // Insert the image URL into the editor content
//   useEffect(() => {
//     if (imageUrl && storyRef.current) {
//       const editor = storyRef.current as HTMLDivElement;
//       const imgTag = `<img src="${imageUrl}" alt="uploaded-image" />`;
//       editor.innerHTML += imgTag;
//     }
//   }, [imageUrl, storyRef]);

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
import { useEffect, useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CodeIcon from "@mui/icons-material/Code";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { uploadImage, resetImage } from "@/lib/features/uploadSlice";

export default function IconSet({
  storyRef,
}: {
  storyRef: React.RefObject<HTMLDivElement>;
}) {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const dispatch = useAppDispatch();
  const imageUrl = useAppSelector((state) => state.upload.url);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(uploadImage(file))
        .then(() => {
          setShowImageUpload(false); // Hide input after uploading
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    }
  };

  // Insert the image URL into the editor content and reset the imageUrl in Redux
  useEffect(() => {
    if (imageUrl && storyRef.current) {
      const editor = storyRef.current as HTMLDivElement;
      const imgTag = `<img src="${imageUrl}" alt="uploaded-image" />`;
      editor.innerHTML = imgTag; // Replace previous content with the new image

      // Reset the imageUrl after inserting the image
      dispatch(resetImage());
    }
  }, [imageUrl, storyRef, dispatch]);

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
