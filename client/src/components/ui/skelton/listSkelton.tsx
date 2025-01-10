import React from "react";
import {
  Skeleton,
  Box,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";
import { ThumbUpAltOutlined, ChatBubbleOutline } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { v4 as uuidv4 } from "uuid";

interface SkeletonListProps {
  selectedTab: string;
}

export default function SkeletonList({ selectedTab }: SkeletonListProps) {
  const renderArticleSkeleton = () => (
    <Box className="p-4 border-b space-y-2 flex flex-col">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Skeleton variant="text" width="70%" height={30} />
          <Skeleton
            variant="rectangular"
            width={100}
            height={100}
            className="rounded-lg"
          />
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Skeleton variant="text" width={60} height={20} />
            <ThumbUpAltOutlined className="text-gray-600" />
            <Skeleton variant="text" width={20} height={20} />
            <ChatBubbleOutline className="text-gray-600" />
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
          </Box>
        </Box>
      </CardContent>
    </Box>
  );

  const renderCollectionSkeleton = () => (
    <Box className="p-4 border-b space-y-2">
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} pb={2}>
          <Skeleton variant="circular" width={25} height={25} />
          <Skeleton variant="text" width={100} height={20} />
        </Box>
        <Skeleton variant="text" width="50%" height={30} />
        <Skeleton variant="text" width="30%" height={20} />
        <CardActions className="flex justify-end">
          <DeleteForeverIcon className="text-gray-600" />
        </CardActions>
      </CardContent>
    </Box>
  );

  return (
    <Box className="space-y-4 mt-6">
      {selectedTab === "Home" ? (
        <>
          {[...Array(3)].map(() => (
            <React.Fragment key={uuidv4()}>
              {renderArticleSkeleton()}
            </React.Fragment>
          ))}
        </>
      ) : selectedTab === "List" ? (
        <>
          {[...Array(3)].map(() => (
            <React.Fragment key={uuidv4()}>
              {renderCollectionSkeleton()}
            </React.Fragment>
          ))}
        </>
      ) : (
        <Typography align="center" color="textSecondary">
          List is empty
        </Typography>
      )}
    </Box>
  );
}
