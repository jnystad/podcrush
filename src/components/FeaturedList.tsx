import React, { FC } from "react";
import { FeedLoader } from "./Feed";
import useBest from "../hooks/useBest";

const FeaturedList: FC<{ region: string }> = ({ region }) => {
  const { best } = useBest(region);
  return (
    <div className="featured-list">
      {best
        .filter((feed) => !!feed.itunes_id)
        .slice(0, 16)
        .map((feed) => (
          <FeedLoader key={feed.itunes_id} id={feed.itunes_id} />
        ))}
    </div>
  );
};

export default FeaturedList;
