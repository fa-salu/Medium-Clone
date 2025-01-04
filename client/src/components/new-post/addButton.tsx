import { useEffect, useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CodeIcon from "@mui/icons-material/Code";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { uploadImage, resetImage } from "@/lib/features/uploadSlice";

export default function IconSet({
  showIcons,
  storyRef,
}: {
  showIcons: boolean;
  storyRef: React.RefObject<HTMLDivElement>;
}) {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const dispatch = useAppDispatch();
  const imageUrl = useAppSelector((state) => state.upload.url);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(uploadImage(file))
        .unwrap()
        .then(() => {
          setShowImageUpload(false);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    }
  };

  useEffect(() => {
    if (imageUrl && storyRef.current) {
      const editor = storyRef.current as HTMLDivElement;

      const imgElement = document.createElement("img");
      imgElement.src = imageUrl;
      imgElement.alt = "uploaded-image";

      editor.appendChild(imgElement);

      dispatch(resetImage());
    }
  }, [imageUrl, storyRef, dispatch]);

  return (
    <>
      {showIcons && (
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
      )}
    </>
  );
}
