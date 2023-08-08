import { useState, useEffect } from "react";
import Loading from "./Loading";
import useSearch from "../hooks/useSearch";
import Feed from "./Feed";
import "./Search.scss";

function Search() {
  const [query, setQuery] = useState("");
  const { results, isLoading, load, reset } = useSearch(query);

  useEffect(() => {
    const clear = (e: KeyboardEvent) => {
      e.which === 27 && reset();
    };
    document.addEventListener("keydown", clear);
    return () => document.removeEventListener("keydown", clear);
  }, [reset]);

  return (
    <div className="search">
      <div className="search-field">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load();
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => load()}
            placeholder="Search"
          />
        </form>
        {isLoading && <Loading small />}
      </div>
      {!!results.length && (
        <div className="search-results">
          {results.slice(0, 10).map((feed) => (
            <Feed key={feed.feedUrl} feed={feed} onClick={reset} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
