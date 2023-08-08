import { useState, useEffect, useRef, useMemo, createContext, ReactNode } from "react";
import { ITrack } from "../types";
import {
  saveTrackProgress,
  getTrackProgress,
  updatePlayedTracks,
  getCurrentTrack,
  saveCurrentTrack,
} from "../utils/storage";
import "./Player.scss";

export interface IPlayerContext {
  play: (track: ITrack) => void;
  pause: () => void;
  currentTrack: ITrack | null;
  isPlaying: boolean;
}

export const PlayerContext = createContext<IPlayerContext>({
  play: () => {},
  pause: () => {},
  currentTrack: null,
  isPlaying: false,
});

function Progress({ value, setProgress }: { value: number; setProgress: (progress: number) => void }) {
  return (
    <div
      className="progress"
      onClick={(e) => {
        const rect = (e.target as HTMLDivElement).getBoundingClientRect();
        const progress = (e.clientX - rect.left) / rect.width;
        setProgress(progress * 100);
      }}
    >
      <div className="value" style={{ width: value + "%" }} />
    </div>
  );
}

export function formatTimestamp(v: number): string {
  const h = Math.floor(v / 60 / 60);
  const m = Math.floor((v % 3600) / 60);
  const s = v % 60;
  return h + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s.toFixed(0) : s.toFixed(0));
}

function Player({ children }: { children: ReactNode }) {
  const [isPlaying, setPlaying] = useState(false);
  const [track, setTrack] = useState<ITrack | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(1);
  const [initialLoad, setInitialLoad] = useState(true);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const currentTrack = getCurrentTrack();
    if (currentTrack) setTrack(currentTrack);
  }, [setTrack]);

  useEffect(() => {
    if (track) saveCurrentTrack(track);
  }, [track]);

  useEffect(() => {
    if (!track) return;

    const progress = getTrackProgress(track);
    if (progress) {
      setTimeout(() => {
        if (audio.current) audio.current.currentTime = progress.currentTime;
      }, 100);
    }

    updatePlayedTracks(track);
  }, [track]);

  useEffect(() => {
    if (!isPlaying || !track) return;
    saveTrackProgress(track, { currentTime, totalTime });
  }, [isPlaying, track, currentTime, totalTime]);

  const togglePlay = useMemo(
    () => () => {
      if (audio.current) {
        if (!isPlaying) {
          setInitialLoad(false);
          audio.current.play();
        } else {
          audio.current.pause();
        }
      }
    },
    [isPlaying]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) =>
      !(e.target instanceof HTMLInputElement) &&
      !(e.target instanceof HTMLButtonElement) &&
      e.which === 32 &&
      togglePlay();
    document.addEventListener("keypress", handleKey);
    return () => document.removeEventListener("keypress", handleKey);
  }, [togglePlay]);

  const context = useMemo(
    () => ({
      play: (playTrack: ITrack) => {
        setInitialLoad(false);
        setTrack(playTrack);
        if (track && track.audioUrl === playTrack.audioUrl) {
          audio.current && audio.current.play();
        }
      },
      pause: () => audio.current && audio.current.pause(),
      currentTrack: track,
      isPlaying,
    }),
    [track, isPlaying]
  );

  return (
    <PlayerContext.Provider value={context}>
      {children}
      <div className={"player" + (track ? "" : " idle")}>
        <button
          key={isPlaying ? "pause" : "play"}
          className={"play" + (isPlaying ? " playing" : "") + (track ? "" : " disabled")}
          onClick={togglePlay}
        />
        <h2>{track ? track.title : "Idle"}</h2>
        {track && (
          <>
            <audio
              ref={audio}
              src={track.audioUrl}
              autoPlay
              preload="auto"
              onTimeUpdate={(e) => setCurrentTime((e.target as HTMLAudioElement).currentTime)}
              onLoadCapture={(e) => {
                setTotalTime((e.target as HTMLAudioElement).duration);
              }}
              onPlay={(e) => {
                const el = e.target as HTMLAudioElement;
                setTotalTime(el.duration);
                if (initialLoad) {
                  setTimeout(() => el.pause(), 10);
                } else {
                  setPlaying(true);
                }
              }}
              onPause={() => setPlaying(false)}
            />
            <img src={track.feed.artworkUrl100} alt="" />
            <h3>{track.feed.collectionName}</h3>
            <Progress
              value={(currentTime / totalTime) * 100}
              setProgress={(p) => {
                if (audio.current) audio.current.currentTime = (p * totalTime) / 100;
              }}
            />
            <p className="timestamps">
              {formatTimestamp(currentTime)} / {formatTimestamp(totalTime)}
            </p>
            <div className="controls">
              <button
                className="skip-back"
                onClick={() => {
                  if (audio.current) {
                    audio.current.currentTime = Math.max(0, audio.current.currentTime - 15);
                  }
                }}
              >
                <svg viewBox="0 0 16 16">
                  <rect width={3} x={2} y={2} height={12} />
                  <polygon points="6,8 14,2 14,14" />
                </svg>
              </button>
              <button
                className="skip-forward"
                onClick={() => {
                  if (audio.current) {
                    audio.current.currentTime = Math.min(audio.current.duration, audio.current.currentTime + 15);
                  }
                }}
              >
                <svg viewBox="0 0 16 16">
                  <rect width={3} x={11} y={2} height={12} />
                  <polygon points="10,8 2,2 2,14" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </PlayerContext.Provider>
  );
}

export default Player;
