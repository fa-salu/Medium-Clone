"use client";

import { ChatBubbleOutline, ThumbUpAltOutlined } from "@mui/icons-material";
import {
  addClaps,
  fetchAllStories,
  fetchSavedCollections,
  fetchStoryByAuthor,
  saveStoryToCollection,
} from "@/lib/features/storySlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import FollowPopover from "@/components/ui/followPopover";
import BookmarkPopover from "@/components/ui/savedStoryPopover";
import Link from "next/link";
import { fetchUserById } from "@/lib/features/userSlice";
import AuthorPageSkelton from "@/components/ui/skelton/authorPage";
import {
  followUser,
  getFollowers,
  getFollowing,
} from "@/lib/features/followPeopleSlice";

export default function Page() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const dispatch = useAppDispatch();
  const author = useAppSelector(
    (state: RootState) => state.userDetail.userDetails
  );
  const ownerId = useAppSelector((state: RootState) => state.user.user?._id);
  const { articles, article, savedCollections, isLoading, error } =
    useAppSelector((state: RootState) => state.story);
  console.log("article:", article);
  const { followers, following, loading, successMessage } = useAppSelector(
    (state: RootState) => state.followUser
  );
  console.log("fwer:", followers);
  console.log("fwing:", following);

  const isFollow = followers.some((follow) => follow.follower._id === ownerId);
  console.log("isfollow", isFollow);
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

  const handleFollows = (authorId: string) => {
    console.log("Hello");
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

  if (!userId) {
    return <AuthorPageSkelton />;
  }

  return (
    <div className="flex space-x-6 px-36">
      {isLoading ? (
        <AuthorPageSkelton />
      ) : (
        <>
          <div className="flex-1 pr-8 space-y-6 border-r">
            {author ? (
              <div className="pt-10 space-y-8">
                <h1 className="text-4xl font-thin">{author?.name}</h1>
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
                    <Link href={`/${story._id}`}>
                      <h2 className="text-xl font-semibold">{story.title}</h2>
                    </Link>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span>
                          {new Date(story.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          type="button"
                          className="flex items-center"
                          onClick={() => handleClap(story._id)}
                        >
                          <ThumbUpAltOutlined className="mr-1 text-gray-600" />
                          {story.claps || 0}
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
                        <FollowPopover
                          authorName={story.authorDetails?.name || "Unknown"}
                          onFollow={() =>
                            handleFollows(story.authorDetails?.name || "")
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {story.coverImage && (
                    <div>
                      <Image
                        src={story.coverImage}
                        alt={story.title || "Story Image"}
                        width={100}
                        height={100}
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No stories available.</p>
            )}
          </div>

          <div className="w-1/3 flex flex-col p-4 space-y-4">
            <div className="flex flex-col space-y-4">
              {author?.imageUri ? (
                <Image
                  src={author.imageUri}
                  alt={author?.name}
                  width={80}
                  height={80}
                  className="object-cover rounded-full"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-300 rounded-full" />
              )}
              <span className="text-xl font-semibold">{author?.name}</span>
              <span>
                {followers.length}
                {"  "}
                Follwers
              </span>
            </div>

            {!owner && (
              <button
                type="button"
                className={`${
                  isFollow
                    ? "w-24 text-sm bg-transparent border border-green-500  text-green-500 py-2  rounded-full mt-2 hover:border-green-600 hover:text-green-600"
                    : "w-24 text-sm bg-green-500 text-white py-2 px-4 rounded-full mt-2 hover:bg-green-600"
                }`}
                onClick={() => handleFollow(author?._id || "")}
              >
                {isFollow ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
