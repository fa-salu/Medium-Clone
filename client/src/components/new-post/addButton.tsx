import { useEffect, useRef } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CodeIcon from "@mui/icons-material/Code";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { uploadImage, resetImage } from "@/lib/features/uploadSlice";
import { RootState } from "@/lib/store";

export default function IconSet({
  showIcons,
  storyRef,
  setCoverImage,
}: {
  showIcons: boolean;
  storyRef: React.RefObject<HTMLDivElement>;
  setCoverImage: (url: string) => void;
}) {
  const dispatch = useAppDispatch();
  const { url, isLoading } = useAppSelector((state: RootState) => state.upload);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(uploadImage(file))
        .unwrap()
        .then(() => {})
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    }
  };

  useEffect(() => {
    if (url) {
      setCoverImage(url);

      if (storyRef.current) {
        const editor = storyRef.current as HTMLDivElement;

        const imgElement = document.createElement("img");
        imgElement.src = url;
        imgElement.alt = "uploaded-image";

        editor.appendChild(imgElement);
      }

      dispatch(resetImage());
    }
  }, [url, storyRef, setCoverImage, dispatch]);

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      {showIcons && (
        <div className="absolute right-40 top-20 flex space-x-2 bg-white shadow-md p-4">
          <AddPhotoAlternateIcon onClick={handleIconClick} />
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleImageUpload}
            className="hidden"
          />

          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <VideoLibraryIcon />
              <InsertDriveFileIcon />
              <CodeIcon />
              <MoreHorizIcon />
            </>
          )}
        </div>
      )}
    </>
  );
}
