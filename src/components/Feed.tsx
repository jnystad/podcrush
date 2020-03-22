import React, { FC } from "react";
import { Link } from "react-router-dom";
import { IFeed } from "../types";
import useFeed from "../hooks/useFeed";
import Loading from "./Loading";
import "./Feed.scss";

export const FeedLoader: FC<{ id: number }> = ({ id }) => {
  const { feed } = useFeed(id);
  if (!feed) return <Loading />;
  return <Feed feed={feed} />;
};

const Feed: FC<{
  feed: IFeed;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}> = ({ feed, onClick }) => {
  return (
    <Link
      to={`/podcast/${feed.collectionId}`}
      className="feed"
      onClick={onClick || undefined}
    >
      <img src={feed.artworkUrl100} alt="Feed logo" />
      <h3>{feed.collectionName}</h3>
      <span className="artist">{feed.artistName}</span>
      <span className="genre">{feed.primaryGenreName}</span>
    </Link>
  );
};

export default Feed;
