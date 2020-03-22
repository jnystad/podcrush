import React, { FC } from "react";
import { ITrack, notEmpty } from "../types";
import { getPlayedTracks, getTrack, getSubscriptions } from "../utils/storage";
import Track from "../components/Track";
import { FeedLoader } from "../components/Feed";
import FeaturedList from "../components/FeaturedList";
import "./FrontPage.scss";

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

const FrontPage: FC = () => {
  const recentTracks = getPlayedTracks();
  const subscriptions = getSubscriptions();

  return (
    <div className="front-page content">
      <div className="subscriptions left">
        <h2>Your subscriptions</h2>
        {subscriptions.length ? (
          subscriptions.map(id => <FeedLoader key={id} id={id} />)
        ) : (
          <>
            <p>You have no subscriptions!</p>
            <p>Use the search field or pick a Podcast below to get started.</p>
          </>
        )}
        <h2>Featured podcasts</h2>
        <FeaturedList />
      </div>
      <div className="recent-tracks right">
        <h2>Recent</h2>
        {recentTracks.length ? (
          recentTracks
            .map(url => getTrack(url))
            .filter(notEmpty)
            .map(t => <PlayedTrack key={t.audioUrl} track={t} />)
        ) : (
          <p>No recent tracks found.</p>
        )}
      </div>
    </div>
  );
};

export default FrontPage;
