import { ITrack, IProgress, IFeed } from "../types";

export function getFeed(id: number): IFeed | null {
  return JSON.parse(localStorage.getItem("podcrush-feed-" + id) || "null");
}

export function saveFeed(feed: IFeed) {
  localStorage.setItem(
    "podcrush-feed-" + feed.collectionId,
    JSON.stringify(feed)
  );
}

export function getTrack(url: string): ITrack | null {
  return JSON.parse(localStorage.getItem("podcrush-track-" + url) || "null");
}

export function saveTrack(track: ITrack) {
  localStorage.setItem(
    "podcrush-track-" + track.audioUrl,
    JSON.stringify(track)
  );
}

export function getCurrentTrack(): ITrack | null {
  const currentTrack = JSON.parse(
    localStorage.getItem("podcrush-player-currentTrack") || "{}"
  );
  if (!currentTrack.url) return null;
  const track = getTrack(currentTrack.url);
  return track;
}

export function saveCurrentTrack(track?: ITrack) {
  localStorage.setItem(
    "podcrush-player-currentTrack",
    JSON.stringify({
      url: track ? track.audioUrl : null
    })
  );

  if (track) saveTrack(track);
}

export function getTrackProgress(track: ITrack): IProgress | null {
  return JSON.parse(
    localStorage.getItem("podcrush-player-progress-" + track.audioUrl) || "null"
  );
}

export function saveTrackProgress(track: ITrack, progress: IProgress) {
  localStorage.setItem(
    "podcrush-player-progress-" + track.audioUrl,
    JSON.stringify(progress)
  );
}

export function getPlayedTracks(): string[] {
  return JSON.parse(
    localStorage.getItem("podcrush-played-tracks") || "[]"
  ) as string[];
}

export function updatePlayedTracks(track: ITrack) {
  const playedTracks = JSON.parse(
    localStorage.getItem("podcrush-played-tracks") || "[]"
  );
  localStorage.setItem(
    "podcrush-played-tracks",
    JSON.stringify([
      track.audioUrl,
      ...playedTracks.filter((t: string) => t !== track.audioUrl)
    ])
  );
}

export function getSubscriptions(): number[] {
  return JSON.parse(localStorage.getItem("podcrush-subscriptions") || "[]");
}

export function saveSubscriptions(subscriptions?: number[]) {
  localStorage.setItem(
    "podcrush-subscriptions",
    JSON.stringify(subscriptions || [])
  );
}

export function checkSubscription(feed: IFeed): boolean {
  const subscriptions = getSubscriptions();
  return subscriptions.indexOf(feed.collectionId) !== -1;
}

export function saveSubscription(feed: IFeed) {
  saveSubscriptions([
    feed.collectionId,
    ...getSubscriptions().filter(s => s !== feed.collectionId)
  ]);

  saveFeed(feed);
}

export function removeSubscription(feed: IFeed) {
  saveSubscriptions(getSubscriptions().filter(s => s !== feed.collectionId));
}
