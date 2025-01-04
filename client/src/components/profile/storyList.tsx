import { useEffect } from "react";
import {
  addClaps,
  deleteStory,
  fetchStoryByAuthor,
  saveStoryToCollection,
  fetchSavedCollections,
} from "@/lib/features/storySlice";
import type { RootState } from "@/lib/store";
import { ThumbUpAltOutlined, ChatBubbleOutline } from "@mui/icons-material";
import BookmarkPopover from "../ui/savedStoryPopover";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import MoreOptionsPopover from "../ui/moreOptionProfile";
import Image from "next/image";
import Link from "next/link";

interface StoryListProps {
  selectedTab: string;
}

export default function StoryList({ selectedTab }: StoryListProps) {
  const dispatch = useAppDispatch();
  const articles = useAppSelector((state: RootState) => state.story.articles);
  const collections = useAppSelector(
    (state: RootState) => state.story.savedCollections || []
  );

  const author = useAppSelector((state: RootState) => state.user.user);
  const authorId = author?._id;

  const handleClap = (storyId: string) => {
    dispatch(addClaps({ storyId }));
  };

  const handleAddToCollection = (collectionName: string, storyId: string) => {
    dispatch(saveStoryToCollection({ storyId, collectionName }));
  };

  const handleDeleteStory = (storyId: string) => {
    dispatch(deleteStory({ storyId }));
    if (authorId) {
      dispatch(fetchStoryByAuthor({ authorId }));
    }
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

  useEffect(() => {
    if (authorId) {
      dispatch(fetchStoryByAuthor({ authorId }));
      dispatch(fetchSavedCollections());
    }
  }, [authorId, dispatch]);

  const noArticles = !articles || articles.length === 0;
  const noCollections = !collections || collections.length === 0;

  return (
    <div className="space-y-4 mt-6">
      {selectedTab === "Home" ? (
        <>
          {noArticles ? (
            <p className="text-center text-gray-500">
              No articles available by this author.
            </p>
          ) : (
            articles.map((article) => (
              <div
                key={article._id}
                className="p-4 border-b space-y-2 flex flex-col"
              >
                <Link href={`${article._id}`}>
                  <div className="flex justify-between">
                    <h2 className="text-lg font-semibold flex-grow pr-4">
                      {article.title}
                    </h2>
                    {/* <img
                      src={article.coverImage}
                      alt={article.title || "Article Image"}
                      className="w-24 h-24 object-cover rounded-lg"
                    /> */}
                  </div>
                </Link>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span>
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      type="button"
                      className="flex items-center"
                      onClick={() => handleClap(article._id)}
                    >
                      <ThumbUpAltOutlined className="mr-1 text-gray-600" />
                      {article.claps || 0}
                    </button>
                    <Link href={`${article._id}`}>
                      <ChatBubbleOutline className="mr-1 text-gray-600" />
                    </Link>
                  </div>
                  <div className="flex items-center space-x-4">
                    <BookmarkPopover
                      storyId={article._id}
                      collections={collections?.map?.((c) => c.collectionName)}
                      onAddToCollection={(collectionName) =>
                        handleAddToCollection(collectionName, article._id)
                      }
                      onCreateNewCollection={(newCollectionName) =>
                        handleCreateNewCollection(
                          newCollectionName,
                          article._id
                        )
                      }
                    />

                    <MoreOptionsPopover
                      onDelete={() => handleDeleteStory(article._id)}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </>
      ) : selectedTab === "List" ? (
        <>
          {noCollections ? (
            <p className="text-center text-gray-500">
              No collections available.
            </p>
          ) : (
            collections.map((collection) => (
              <div
                key={collection.collectionName}
                className="p-4 border-b space-y-2"
              >
                <div className="flex pb-3 ">
                  {author?.imageUri && (
                    <Image
                      src={author?.imageUri}
                      alt={author?.name}
                      width={25}
                      height={25}
                      className="rounded-full bg-gray-500"
                    />
                  )}
                  <p>{author?.name}</p>
                </div>
                <Link href={`/list/${collection.collectionName}`}>
                  {" "}
                  <h2 className="text-lg font-semibold">
                    {collection.collectionName}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {collection.stories.flat().length}{" "}
                    {collection.stories.flat().length === 1
                      ? "story"
                      : "stories"}
                  </p>
                </Link>
              </div>
            ))
          )}
        </>
      ) : (
        <div>List is empty</div>
      )}
    </div>
  );
}
