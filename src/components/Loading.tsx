import "./Loading.scss";

const Loading = ({ small }: { small?: boolean }) => (
  <div className="loading-mask">
    <div className={"loading" + (small ? " small" : "")}>
      <span />
      <span />
      <span />
    </div>
  </div>
);

export default Loading;
