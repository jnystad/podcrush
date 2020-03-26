import React, { useState, useMemo, FC } from "react";
import { useParams } from "react-router";
import { IFeed, ITrack } from "../types";
import Loading from "../components/Loading";
import Track from "../components/Track";
import {
  checkSubscription,
  removeSubscription,
  saveSubscription
} from "../utils/storage";
import useFeed from "../hooks/useFeed";
import useFeedDetails from "../hooks/useFeedDetails";
import "./FeedPage.scss";

const Subscribe: React.FC<{ feed: IFeed }> = ({ feed }) => {
  const [nonce, setNonce] = useState(1);
  const isSubscribed = useMemo(() => nonce && checkSubscription(feed), [
    feed,
    nonce
  ]);
  return (
    <button
      className={"subscribe" + (isSubscribed ? " subscribed" : "")}
      onClick={() => {
        isSubscribed ? removeSubscription(feed) : saveSubscription(feed);
        setNonce(n => n + 1);
      }}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </button>
  );
};

const FeedTrack: React.FC<{ track: ITrack }> = ({ track }) => (
  <Track track={track}>
    <h3>{track.title}</h3>
    <p
      className="description"
      dangerouslySetInnerHTML={{ __html: track.summary || track.description }}
    />
    {track.duration && (
      <span className="duration">Duration: {track.duration} </span>
    )}
    {track.date && (
      <span className="date">Released: {track.date.toDateString()} </span>
    )}
  </Track>
);

const FeedPage: FC = () => {
  const { id } = useParams();
  const { feed } = useFeed(parseInt(id || "0"));
  const { meta, tracks, isLoading, isError } = useFeedDetails(feed);

  if (!feed) return <Loading />;

  return (
    <div className="feed-page content">
      <div className="info left">
        <div className="artwork">
          <img src={feed.artworkUrl600} alt={feed.collectionName} />
        </div>
        <Subscribe feed={feed} />
        <h1>
          <a href={meta.link} target="_blank" rel="noopener noreferrer">
            {feed.collectionName}
          </a>
        </h1>
        <p
          className="summary"
          dangerouslySetInnerHTML={{ __html: meta.summary }}
        />
      </div>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <div className="right error">Could not load feed.</div>
      ) : (
        <div className="tracks right">
          {tracks.slice(0, 20).map(track => (
            <FeedTrack key={track.audioUrl} track={track} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedPage;
