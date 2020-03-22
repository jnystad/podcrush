import React, { useState, useEffect } from "react";
import "./App.scss";
import Search from "./components/Search";
import { IFeed } from "./types";
import Feed from "./components/Feed";
import Player from "./components/Player";
import FrontPage from "./components/FrontPage";
import Waves from "./components/Waves";
import { getFeed, saveFeed } from "./utils/storage";

const App: React.FC = () => {
  const [feed, setFeed] = useState<IFeed>();

  useEffect(() => {
    const path = window.location.pathname;
    const rx = /^\/podcast\/(\d+)/;
    if (rx.test(path)) {
      const m = rx.exec(path);
      const id = (m && parseInt(m[1])) || 0;
      const feed = getFeed(id);
      if (feed) setFeed(feed);
    }
  }, []);

  useEffect(() => {
    const dest = { path: "/", title: "PodCrush" };
    if (feed) {
      dest.title = feed.collectionName + " | PodCrush";
      dest.path = "/podcast/" + feed.collectionId;
    }

    if (window.location.pathname !== dest.path) {
      window.history.pushState(null, dest.title, dest.path);
    }
  }, [feed]);

  useEffect(() => {
    if (feed) {
      saveFeed(feed);
      document.title = feed.collectionName + " | PodCrush";
    } else document.title = "PodCrush";
  }, [feed]);

  return (
    <React.Fragment>
      <Waves />
      <div className="App">
        <Player>
          <nav className="nav-bar">
            <h1 className="title">PodCrush</h1>
            <button className="icon" onClick={() => setFeed(undefined)}>
              <svg width={16} height={16} viewBox="0 0 16 16">
                <polygon
                  points="2,8 12,0 14,2 6,8 14,14 12,16"
                  fill="currentColor"
                />
              </svg>
            </button>
            <Search onSelect={feed => setFeed(feed)} />
          </nav>
          {feed ? (
            <Feed feed={feed} />
          ) : (
            <FrontPage onFeedOpen={feed => setFeed(feed)} />
          )}
        </Player>
      </div>
    </React.Fragment>
  );
};

export default App;
