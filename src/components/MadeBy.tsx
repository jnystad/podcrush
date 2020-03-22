import React, { FC } from "react";
import githubMark from "../assets/github-mark.svg";

const MadeBy: FC = () => (
  <div className="made-by">
    Made by{" "}
    <a
      href="https://github.com/jnystad/podcrush"
      target="_blank"
      rel="noreferrer noopener"
    >
      <img
        src={githubMark}
        alt="GitHub"
        width={24}
        style={{ verticalAlign: "middle", marginRight: 3 }}
      />
      Jørgen Nystad
    </a>
  </div>
);

export default MadeBy;
