import React, { useContext, ReactNode } from "react";
import { ITrack } from "../types";
import { PlayerContext } from "./Player";
import { getTrackProgress } from "../utils/storage";

const Track: React.FC<{ track: ITrack; children: ReactNode }> = ({
  track,
  children
}) => {
  const playerContext = useContext(PlayerContext);
  const progress = getTrackProgress(track);

  const playingThis =
    playerContext.isPlaying &&
    playerContext.currentTrack &&
    playerContext.currentTrack.audioUrl === track.audioUrl;
  return (
    <div
      className={
        "track" +
        (progress && progress.currentTime > progress.totalTime * 0.9
          ? " done"
          : "")
      }
    >
      <button
        key={playingThis ? "pause" : "play"}
        className={"play" + (playingThis ? " playing" : "")}
        onClick={() =>
          playingThis ? playerContext.pause() : playerContext.play(track)
        }
        title={progress && progress.currentTime > 5 ? "Resume" : "Play"}
      />
      <div className="track-info">{children}</div>
    </div>
  );
};

export default Track;
