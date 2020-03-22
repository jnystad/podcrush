import React from "react";
import { ITrack, notEmpty, IFeed } from "../types";
import "./FrontPage.scss";
import {
  getPlayedTracks,
  getTrack,
  getSubscriptions,
  getFeed
} from "../utils/storage";
import Track from "./Track";

const SubscribedFeed: React.FC<{ feed: IFeed; onClick: () => void }> = ({
  feed,
  onClick
}) => (
  <div className="subscription" onClick={onClick}>
    <img src={feed.artworkUrl100} alt={feed.collectionName} />
    <h3>{feed.collectionName}</h3>
    <p>{feed.artistName}</p>
  </div>
);

const PlayedTrack: React.FC<{ track: ITrack }> = ({ track }) => (
  <Track track={track}>
    <img src={track.feed.artworkUrl100} alt={track.feed.collectionName} />
    <h3>{track.title}</h3>
    <p
      className="description"
      dangerouslySetInnerHTML={{ __html: track.description }}
    />
    {track.duration && (
      <span className="duration">Duration: {track.duration} </span>
    )}
    {track.date && (
      <span className="date">
        Released:{" "}
        {track.date instanceof Date
          ? track.date.toDateString()
          : new Date(track.date).toDateString()}
      </span>
    )}
  </Track>
);

const FrontPage: React.FC<{ onFeedOpen: (feed: IFeed) => void }> = ({
  onFeedOpen
}) => {
  const recentTracks = getPlayedTracks();
  const subscriptions = getSubscriptions();

  return (
    <div className="front-page content">
      <div className="subscriptions left">
        <h2>Subscriptions</h2>
        {subscriptions
          .map(id => getFeed(id))
          .filter(notEmpty)
          .map(f => (
            <SubscribedFeed
              key={f.collectionId}
              feed={f}
              onClick={() => onFeedOpen(f)}
            />
          ))}
      </div>
      <div className="recent-tracks right">
        <h2>Resume listening</h2>
        {recentTracks
          .map(url => getTrack(url))
          .filter(notEmpty)
          .map(t => (
            <PlayedTrack key={t.audioUrl} track={t} />
          ))}
      </div>
    </div>
  );
};

export default FrontPage;
