import { useEffect, useRef, useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CodeIcon from "@mui/icons-material/Code";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { uploadImageOrVideo, resetImage } from "@/lib/features/uploadSlice";
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

  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(uploadImageOrVideo(file))
        .unwrap()
        .then(() => {})
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  };

  useEffect(() => {
    if (url) {
      setCoverImage(url);

      if (storyRef.current) {
        const editor = storyRef.current as HTMLDivElement;

        const element = document.createElement(
          fileType === "video" ? "video" : "img"
        );

        if (fileType === "video") {
          const videoElement = element as HTMLVideoElement;
          videoElement.src = url;
          videoElement.controls = true;
          videoElement.classList.add("w-full");
        } else {
          const imageElement = element as HTMLImageElement;
          imageElement.src = url;
          imageElement.alt = "uploaded-image";
          imageElement.classList.add("w-full");
        }

        editor.appendChild(element);

        const descriptionDiv = document.createElement("div");
        descriptionDiv.classList.add(
          "mt-2",
          "border-b",
          "p-2",
          "text-center",
          "text-sm",
          "mb-2"
        );

        descriptionDiv.style.color = "#333333";
        editor.appendChild(descriptionDiv);
      }

      dispatch(resetImage());
    }
  }, [url, storyRef, setCoverImage, dispatch, fileType]);

  const handleIconClick = (type: "image" | "video") => {
    setFileType(type);
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === "image" ? "image/*" : "video/*";
      fileInputRef.current.click();
    }
  };

  return (
    <>
      {showIcons && (
        <div className="fixed z-50 right-0 sm:right-40 sm:top-20 flex space-x-2 bg-white shadow-md p-4">
          <AddPhotoAlternateIcon onClick={() => handleIconClick("image")} />
          <VideoLibraryIcon onClick={() => handleIconClick("video")} />
          <InsertDriveFileIcon />
          <CodeIcon />
          <MoreHorizIcon />
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
          />
          {isLoading ? <CircularProgress size={24} /> : <></>}
        </div>
      )}
    </>
  );
}
