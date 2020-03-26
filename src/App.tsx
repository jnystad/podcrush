import React, { FC } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  Link,
  useLocation
} from "react-router-dom";
import Search from "./components/Search";
import Player from "./components/Player";
import FeedPage from "./pages/FeedPage";
import FrontPage from "./pages/FrontPage";
import Waves from "./components/Waves";
import MadeBy from "./components/MadeBy";
import "./App.scss";

function Circle({
  r,
  w = 1,
  rotate = 0,
  color
}: {
  r: number;
  w?: number;
  rotate?: number;
  color: string;
}) {
  return (
    <g transform={`rotate(${rotate + 180} 10 10)`}>
      <path
        d={`M 10,10 m -${r},0 A ${r} ${r} 0 1 1 10 ${10 + r}`}
        stroke={color}
        fill="none"
        strokeWidth={w}
      />
    </g>
  );
}

function Logo() {
  return (
    <div className="logo">
      <svg viewBox="0 0 20 20" width={36} height={36}>
        <Circle r={9} w={1} rotate={60} color="#046" />
        <Circle r={7} w={0.9} rotate={-30} color="#09a" />
        <Circle r={5} w={0.8} rotate={180} color="#aef" />
        <Circle r={3} w={0.7} rotate={-45} color="#09a" />
      </svg>{" "}
      <h1 className="title">
        <span className="pod">Pod</span>Crush
      </h1>
    </div>
  );
}

const Nav: FC = () => {
  const { pathname } = useLocation();

  return (
    <nav className="nav-bar">
      <Logo />
      <Link
        to="/"
        className={"icon" + (pathname === "/" ? " disabled" : "")}
        title="Go to front page"
      >
        <svg width={16} height={16} viewBox="0 0 16 16">
          <polygon points="2,8 12,0 14,2 6,8 14,14 12,16" fill="currentColor" />
        </svg>
      </Link>
      <Search />
      <div className="spacer" />
      <MadeBy />
    </nav>
  );
};

const App: FC = () => {
  return (
    <BrowserRouter>
      <Waves />
      <div className="App">
        <Player>
          <Nav />
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
