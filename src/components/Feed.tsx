import React, { useState, useEffect, useMemo } from "react";
import "./Feed.scss";
import { IFeed, ITrack } from "../types";
import Loading from "./Loading";
import Track from "./Track";
import {
  checkSubscription,
  removeSubscription,
  saveSubscription
} from "../utils/storage";
import request from "superagent";

function tagValue(item: Element | Document, tag: string): string {
  try {
    return item.getElementsByTagName(tag)[0].textContent || "";
  } catch (err) {
    console.warn(item, err);
    return "";
  }
}

function attrValue(
  item: Element | Document,
  tag: string,
  attr: string
): string {
  try {
    const a = item.getElementsByTagName(tag)[0].attributes.getNamedItem(attr);
    return (a && a.value) || "";
  } catch (err) {
    console.warn(item, err);
    return "";
  }
}

function toTrack(item: Element, feed: IFeed): ITrack {
  return {
    feed: feed,
    title: tagValue(item, "title"),
    date: new Date(tagValue(item, "pubDate")),
    description: tagValue(item, "itunes:subtitle"),
    link: tagValue(item, "link"),
    image: attrValue(item, "itunes:image", "href"),
    audioUrl: attrValue(item, "enclosure", "url"),
    duration: tagValue(item, "itunes:duration")
  };
}

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
      dangerouslySetInnerHTML={{ __html: track.description }}
    />
    {track.duration && (
      <span className="duration">Duration: {track.duration} </span>
    )}
    {track.date && (
      <span className="date">Released: {track.date.toDateString()} </span>
    )}
  </Track>
);

const Feed: React.FC<{ feed: IFeed }> = ({ feed }) => {
  const [meta, setMeta] = useState<any>({});
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [tracks, setTracks] = useState<ITrack[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setMeta({});
    setTracks([]);

    const req = request.get(
      "/api/feed?id=" + encodeURIComponent(feed.collectionId)
    );

    req
      .then(res => new DOMParser().parseFromString(res.text, "text/xml"))
      .then(res => {
        const items: Element[] = Array.prototype.slice.call(
          res.getElementsByTagName("item")
        );
        setTracks(items.map(item => toTrack(item, feed)));
        setMeta({
          summary: tagValue(res, "itunes:summary"),
          link: tagValue(res, "link")
        });
        setLoading(false);
      })
      .catch(err => {
        if (err.code && err.code === "ABORTED") return;
        console.error(err);
        setLoading(false);
        setError(true);
      });

    return () => req.abort();
  }, [feed]);

  return (
    <div className="feed content">
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
        <p className="summary">{meta.summary}</p>
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

export default Feed;
