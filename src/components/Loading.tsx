import React from "react";
import "./Loading.scss";

const Loading: React.FC<{ small?: boolean }> = ({ small }) => (
  <div className="loading-mask">
    <div className={"loading" + (small ? " small" : "")}>
      <span />
      <span />
      <span />
    </div>
  </div>
);

export default Loading;
