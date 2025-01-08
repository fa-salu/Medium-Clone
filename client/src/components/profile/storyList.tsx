import { useEffect } from "react";
import {
  addClaps,
  deleteStory,
  fetchStoryByAuthor,
  saveStoryToCollection,
  fetchSavedCollections,
  deleteCollection,
} from "@/lib/features/storySlice";
import type { RootState } from "@/lib/store";
import { ThumbUpAltOutlined, ChatBubbleOutline } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import BookmarkPopover from "../ui/savedStoryPopover";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import MoreOptionsPopover from "../ui/moreOptionProfile";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import SkeletonList from "../ui/skelton/listSkelton";
import FormattedDate from "../ui/timeFormat";
import parse from "html-react-parser";

interface StoryListProps {
  selectedTab: string;
}

export default function StoryList({ selectedTab }: StoryListProps) {
  const dispatch = useAppDispatch();
  const { articles, isLoading } = useAppSelector(
    (state: RootState) => state.story
  );
  const collections = useAppSelector(
    (state: RootState) => state.story.savedCollections || []
  );

  const author = useAppSelector((state: RootState) => state.user.user);
  const authorId = author?._id;

  useEffect(() => {
    if (authorId) {
      dispatch(fetchStoryByAuthor({ authorId }));
      dispatch(fetchSavedCollections());
    }
  }, [authorId, dispatch]);

  const handleClap = (storyId: string) => {
    dispatch(addClaps({ storyId }));
  };

  const handleAddToCollection = (collectionName: string, storyId: string) => {
    dispatch(saveStoryToCollection({ storyId, collectionName }));
  };

  const handleDeleteStory = (storyId: string) => {
    dispatch(deleteStory({ storyId })).then(() => {
      if (authorId) {
        dispatch(fetchStoryByAuthor({ authorId }));
      }
    });
  };

  const handleDeleteCollection = (collectionName: string) => {
    dispatch(deleteCollection({ collectionName })).then(() => {
      dispatch(fetchSavedCollections());
    });
  };

  const handleEdit = (storyId: string) => {
    if (storyId) {
      Cookies.set("storyId", storyId);
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

  const noArticles = !articles || articles.length === 0;
  const noCollections = !collections || collections.length === 0;

  const containsImageOrAnchorTag = (html: string): boolean => {
    const regex = /<img[^>]*>|<a[^>]*>/i;
    return regex.test(html);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonList selectedTab={selectedTab} />
      ) : (
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
                    <Link href={`/${article._id}`}>
                      <div className="flex justify-between over">
                        <div className="flex-grow pr-4">
                          <h2 className="text-xl font-semibold pb-2">
                            {article.title}
                          </h2>
                          {!containsImageOrAnchorTag(article.content) && (
                            <div className="text-sm text-gray-600 mt-1 line-clamp-3">
                              {parse(article.content)}
                            </div>
                          )}
                        </div>
                        {article.coverImage && (
                          <Image
                            src={article.coverImage}
                            alt={article.title || "Article Image"}
                            width={100}
                            height={100}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        )}
                      </div>
                    </Link>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span>
                          <FormattedDate date={article.createdAt} />
                        </span>
                        <button
                          type="button"
                          className="flex items-center"
                          onClick={() => handleClap(article._id)}
                        >
                          <ThumbUpAltOutlined className="mr-1 text-gray-600" />
                          {article.claps > 0 ? article.claps : ""}
                        </button>
                        <Link href={`${article._id}`}>
                          <ChatBubbleOutline className="mr-1 text-gray-600" />
                        </Link>
                      </div>
                      <div className="flex items-center space-x-4">
                        <BookmarkPopover
                          storyId={article._id}
                          collections={collections?.map?.(
                            (c) => c.collectionName
                          )}
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
                          onEdit={() => handleEdit(article._id)}
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
                    <div className="flex items-end justify-end">
                      <DeleteForeverIcon
                        onClick={() =>
                          handleDeleteCollection(collection.collectionName)
                        }
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            <div>List is empty</div>
          )}
        </div>
      )}
    </>
  );
}
