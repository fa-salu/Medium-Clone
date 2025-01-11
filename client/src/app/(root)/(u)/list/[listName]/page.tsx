"use client";

import AuthorDetails from "@/components/profile/authorDetails";
import PopoverMenu from "@/components/ui/RemovePopover";
import CollectionSkeleton from "@/components/ui/skelton/listCollection";
import FormattedDate from "@/components/ui/timeFormat";
import {
  addClaps,
  fetchStoryByListName,
  saveStoryToCollection,
} from "@/lib/features/storySlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import {
  ChatBubbleOutline,
  MoreHoriz,
  ThumbUpAltOutlined,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { type MouseEvent, useEffect, useState } from "react";

interface AuthorDetailss {
  imageUri?: string;
  name?: string;
}

interface Story {
  _id: string;
  title: string;
  claps: number;
  createdAt: string;
  authorDetails?: AuthorDetailss;
}

interface SavedCollection {
  collectionName: string;
  stories: Story[];
}

export default function Page() {
  const params = useParams();
  const listName = params.listName as string;
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedStory, setSelectedStory] = useState<{
    storyId: string;
    collectionName: string;
  } | null>(null);

  const collections = useAppSelector(
    (state: RootState) => state.story.savedCollections
  ) as unknown as SavedCollection | null;

  const isLoading = useAppSelector((state: RootState) => state.story.isLoading);

  useEffect(() => {
    dispatch(fetchStoryByListName(listName));
  }, [dispatch, listName]);

  const handleClap = (storyId: string) => {
    dispatch(addClaps({ storyId })).then(() => {
      dispatch(fetchStoryByListName(listName));
    });
  };

  const handleMoreClick = (
    event: MouseEvent<SVGSVGElement>,
    storyId: string,
    collectionName: string
  ) => {
    setAnchorEl(event.currentTarget as unknown as HTMLElement);
    setSelectedStory({ storyId, collectionName });
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedStory(null);
  };

  const handleRemove = (storyId: string, collectionName: string) => {
    dispatch(saveStoryToCollection({ storyId, collectionName })).then(() => {
      dispatch(fetchStoryByListName(listName));
    });
    handleClosePopover();
  };

  return (
    <>
      {isLoading ? (
        <div>
          <CollectionSkeleton />
        </div>
      ) : (
        <div className="flex px-4 space-x-6 sm:p-12">
          <div className="w-full sm:w-2/3 sm:ml-20 sm:border-r">
            {collections ? (
              <div key={collections.collectionName} className="space-y-4">
                <h1 className="text-2xl border-b py-4 capitalize">
                  {collections.collectionName}
                </h1>

                {collections.stories?.length > 0 ? (
                  collections.stories.map((story) => (
                    <div
                      key={story._id}
                      className="p-4 border-b space-y-2 flex flex-col"
                    >
                      <div className="flex items-center space-x-2">
                        {story.authorDetails?.imageUri ? (
                          <Image
                            src={story.authorDetails.imageUri}
                            alt={story.authorDetails?.name || "Author Name"}
                            width={50}
                            height={50}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-900" />
                        )}
                        <p>{story.authorDetails?.name}</p>
                      </div>
                      <Link href={`/${story._id}`}>
                        <div className="flex justify-between">
                          <h2 className="text-lg font-semibold flex-grow pr-4">
                            {story.title}
                          </h2>
                        </div>
                      </Link>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <span>
                            <FormattedDate date={story.createdAt} />
                          </span>
                          <button
                            type="button"
                            className="flex items-center"
                            onClick={() => handleClap(story._id)}
                          >
                            <ThumbUpAltOutlined className="mr-1 text-gray-600" />
                            {story.claps > 0 ? story.claps : ""}
                          </button>
                          <span className="flex items-center">
                            <ChatBubbleOutline className="mr-1 text-gray-600" />
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <MoreHoriz
                            onClick={(e: MouseEvent<SVGSVGElement>) =>
                              handleMoreClick(
                                e,
                                story._id,
                                collections.collectionName
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No stories available in this collection.</p>
                )}
              </div>
            ) : (
              <p>No collections available.</p>
            )}
          </div>

          <div className="sm:w-1/3">
            <AuthorDetails />
          </div>
          {selectedStory && (
            <PopoverMenu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClosePopover}
              onRemove={handleRemove}
              storyId={selectedStory.storyId}
              collectionName={selectedStory.collectionName}
            />
          )}
        </div>
      )}
    </>
  );
}
