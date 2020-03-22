import React, { FC } from "react";
import useSearch from "../hooks/useSearch";
import Feed from "./Feed";
import { IFeed } from "../types";

const TermList: FC<{
  term: string;
  count: number;
  onSelect: (feed: IFeed) => void;
}> = ({ term, count, onSelect }) => {
  const { results } = useSearch(term);
  return (
    <div className="term-list">
      {results.slice(0, count).map(feed => (
        <Feed feed={feed} onClick={() => onSelect(feed)} />
      ))}
    </div>
  );
};

export default TermList;
