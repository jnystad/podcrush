import { useState, useEffect } from "react";
import request from "superagent";
import sanitizeHtml from "sanitize-html";
import { ITrack, IFeed } from "../types";

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

function sanitize(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ["b", "i", "em", "strong", "a"],
    allowedAttributes: {
      a: ["href"]
    }
  });
}

export default function useFeedDetails(feed: IFeed | null) {
  const [meta, setMeta] = useState<any>({});
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [tracks, setTracks] = useState<ITrack[]>([]);

  useEffect(() => {
    if (!feed) return;

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
          summary: sanitize(tagValue(res, "itunes:summary")),
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

  return { meta, tracks, isLoading, isError };
}