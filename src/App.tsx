import React, { FC } from "react";
import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";
import Search from "./components/Search";
import Player from "./components/Player";
import FeedPage from "./pages/FeedPage";
import FrontPage from "./pages/FrontPage";
import Waves from "./components/Waves";
import "./App.scss";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Waves />
      <div className="App">
        <Player>
          <nav className="nav-bar">
            <h1 className="title">PodCrush</h1>
            <Link to="/" className="icon">
              <svg width={16} height={16} viewBox="0 0 16 16">
                <polygon
                  points="2,8 12,0 14,2 6,8 14,14 12,16"
                  fill="currentColor"
                />
              </svg>
            </Link>
            <Search />
          </nav>
          <Switch>
            <Route exact path="/podcast/:id">
              <FeedPage />
            </Route>
            <Route exact path="/">
              <FrontPage />
            </Route>
            <Redirect to="/" />
          </Switch>
          >
        </Player>
      </div>
    </BrowserRouter>
  );
};

export default App;
