"use client";

import {
  ChatBubbleOutline,
  ThumbUpAltOutlined,
  Menu,
} from "@mui/icons-material";
import {
  addClaps,
  fetchAllStories,
  fetchSavedCollections,
  fetchStoryByAuthor,
  saveStoryToCollection,
} from "@/lib/features/storySlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import BookmarkPopover from "@/components/ui/savedStoryPopover";
import Link from "next/link";
import { fetchUserById } from "@/lib/features/userSlice";
import AuthorPageSkelton from "@/components/ui/skelton/authorPage";
import {
  followUser,
  getFollowers,
  getFollowing,
} from "@/lib/features/followPeopleSlice";
import FormattedDate from "@/components/ui/timeFormat";
import parse from "html-react-parser";
import { Drawer, IconButton } from "@mui/material";

export default function Page() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const dispatch = useAppDispatch();
  const author = useAppSelector(
    (state: RootState) => state.userDetail.userList
  );

  const ownerId = useAppSelector((state: RootState) => state.user.user?._id);
  const { articles, savedCollections, isLoading } = useAppSelector(
    (state: RootState) => state.story
  );
  const { followers } = useAppSelector((state: RootState) => state.followUser);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const isFollow = followers.some((follow) => follow.follower._id === ownerId);
  const owner = ownerId === userId;

  const collections = savedCollections || [];

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
      dispatch(fetchStoryByAuthor({ authorId: userId }));
      dispatch(getFollowers(userId));
      dispatch(getFollowing(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    dispatch(fetchAllStories("For You"));
    dispatch(fetchSavedCollections());
  }, [dispatch]);

  const handleClap = (storyId: string) => {
    dispatch(addClaps({ storyId }));
  };

  const handleAddToCollection = (collectionName: string, storyId: string) => {
    dispatch(saveStoryToCollection({ storyId, collectionName }));
  };

  const handleFollow = (authorId: string) => {
    dispatch(followUser(authorId)).then(() => {
      dispatch(getFollowers(authorId));
      dispatch(getFollowing(authorId));
    });
  };

  const handleCreateNewCollection = (
    newCollectionName: string,
    storyId: string
  ) => {
    dispatch(
      saveStoryToCollection({
        storyId,
        collectionName: newCollectionName,
      })
    );
  };

  const removeImageAndAnchorTags = (html: string): string => {
    const regex =
      /<img[^>]*>|<a[^>]*>.*?<\/a>|<h2[^>]*>.*?<\/h2>|<h3[^>]*>.*?<\/h3>|<br\s*\/?>|<video[^>]*>.*?<\/video>|<div[^>]*>.*?<\/div>/gi;
    return html.replace(regex, "");
  };

  if (!userId) {
    return <AuthorPageSkelton />;
  }

  return (
    <div className="flex flex-col md:flex-row md:space-x-6 px-6 md:px-36">
      <div className="flex-1 px-3 sm:px-0 sm:pr-8 space-y-6 sm:border-r">
        {isLoading ? (
          <AuthorPageSkelton />
        ) : (
          <>
            {author ? (
              <div className="pt-10 space-y-8">
                <h1 className="text-4xl font-thin">{author?.name}</h1>
                <IconButton
                  onClick={() => setDrawerOpen(true)}
                  className="absolute top-10 z-30 right-3"
                >
                  <Menu />
                </IconButton>
                <hr className="my-4" />
              </div>
            ) : (
              <p className="text-gray-500">Author not found</p>
            )}

            {articles && articles.length > 0 ? (
              articles.map((story) => (
                <div
                  key={story._id}
                  className="p-4 border-b flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0"
                >
                  <div className="flex flex-col flex-1 space-y-4">
                    <Link
                      href={`/${story._id}`}
                      className="flex justify-between"
                    >
                      <div className="flex-grow">
                        <h2 className="text-xl font-semibold">{story.title}</h2>
                        <div className="text-sm text-gray-600 mt-1 line-clamp-3">
                          {parse(removeImageAndAnchorTags(story.content))}
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        {story.coverImage && (
                          <Image
                            src={story.coverImage}
                            alt={story.title || "Story Image"}
                            width={150}
                            height={150}
                            className="object-cover rounded-md w-24 h-24"
                          />
                        )}
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
                        <Link href={`/${story._id}`}>
                          <ChatBubbleOutline className="mr-1 text-gray-600" />
                        </Link>
                      </div>
                      <div className="flex items-center space-x-4">
                        <BookmarkPopover
                          storyId={story._id}
                          collections={collections?.map?.(
                            (c) => c.collectionName
                          )}
                          onAddToCollection={(collectionName) =>
                            handleAddToCollection(collectionName, story._id)
                          }
                          onCreateNewCollection={(newCollectionName) =>
                            handleCreateNewCollection(
                              newCollectionName,
                              story._id
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No stories available.</p>
            )}
          </>
        )}
      </div>

      <div className="md:w-1/3 flex flex-col p-4 space-y-4">
        <div className="md:hidden relative">
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <div className="p-4 w-72">
              {author?.imageUri ? (
                <div className="relative w-20 h-20 mx-auto">
                  <Image
                    src={author.imageUri}
                    alt={author?.name || "Author Avatar"}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto" />
              )}
              <span className="text-xl font-semibold text-center block mt-4">
                {author?.name || "Unknown Author"}
              </span>
              <span className="block text-center">
                {followers.length} Followers
              </span>
              {!owner && (
                <button
                  type="button"
                  className={`${
                    isFollow
                      ? "w-full text-sm bg-transparent border border-green-500  text-green-500 py-2 mt-2 rounded-full hover:border-green-600 hover:text-green-600"
                      : "w-full text-sm bg-green-500 text-white py-2 mt-2 rounded-full hover:bg-green-600"
                  }`}
                  onClick={() => handleFollow(author?._id || "")}
                >
                  {isFollow ? "Following" : "Follow"}
                </button>
              )}
              <div className="mt-2">
                <span className="text-gray-500">{author?.bio}</span>
              </div>
            </div>
          </Drawer>
        </div>

        <div className="hidden md:flex flex-col items-center space-y-4">
          {author?.imageUri ? (
            <div className="relative w-20 h-20">
              <Image
                src={author.imageUri}
                alt={author?.name || "Author Avatar"}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
          ) : (
            <div className="w-20 h-20 bg-gray-300 rounded-full" />
          )}
          <span className="text-xl font-semibold">
            {author?.name || "Unknown Author"}
          </span>
          <span className="text-gray-500">{author?.bio}</span>
          <span>{followers.length} Followers</span>
          {!owner && (
            <button
              type="button"
              className={`${
                isFollow
                  ? "text-sm bg-transparent border border-green-500  text-green-500 py-2 px-4 mt-2 rounded-full hover:border-green-600 hover:text-green-600"
                  : "text-sm bg-green-500 text-white py-2 px-4 mt-2 rounded-full hover:bg-green-600"
              }`}
              onClick={() => handleFollow(author?._id || "")}
            >
              {isFollow ? "Following" : "Follow"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
