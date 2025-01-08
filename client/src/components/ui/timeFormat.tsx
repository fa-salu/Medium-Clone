import { formatDistanceToNow, format } from "date-fns";

interface FormattedDateProps {
  date: string;
}

export default function FormattedDate({ date }: FormattedDateProps) {
  const formatArticleDate = (createdAt: string): string => {
    const articleDate = new Date(createdAt);
    const now = new Date();

    const relativeTime = formatDistanceToNow(articleDate, { addSuffix: true });

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    return articleDate < oneWeekAgo
      ? format(articleDate, "MMMM d")
      : relativeTime;
  };

  return <span>{formatArticleDate(date)}</span>;
}
