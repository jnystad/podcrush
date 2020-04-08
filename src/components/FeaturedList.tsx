import React, { FC } from "react";
import Feed from "./Feed";
import useFeatured from "../hooks/useFeatured";

const FeaturedList: FC = () => {
  const { featured } = useFeatured();
  return (
    <div className="featured-list">
      {featured.map((feed) => (
        <Feed key={feed.collectionId} feed={feed} />
      ))}
    </div>
  );
};

export default FeaturedList;
