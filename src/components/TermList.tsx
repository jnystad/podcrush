import useSearch from "../hooks/useSearch";
import Feed from "./Feed";
import { IFeed } from "../types";

function TermList({ term, count, onSelect }: { term: string; count: number; onSelect: (feed: IFeed) => void }) {
  const { results } = useSearch(term);
  return (
    <div className="term-list">
      {results.slice(0, count).map((feed) => (
        <Feed key={feed.feedUrl} feed={feed} onClick={() => onSelect(feed)} />
      ))}
    </div>
  );
}

export default TermList;
