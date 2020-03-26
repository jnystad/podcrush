export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

export interface IFeed {
  collectionId: number;
  feedUrl: string;
  collectionName: string;
  artistName: string;
  artworkUrl100: string;
  artworkUrl600: string;
  primaryGenreName: string;
  genres: string[];
}

export interface ITrack {
  feed: IFeed;
  link: string;
  title: string;
  date: Date;
  description: string;
  summary: string;
  image: string;
  duration: string;
  audioUrl: string;
}

export interface IProgress {
  currentTime: number;
  totalTime: number;
}
