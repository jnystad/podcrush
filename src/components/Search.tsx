import React, { useState, useEffect } from "react";
import request from "superagent";
import useDebounce from "../hooks/useDebounce";
import { IFeed } from "../types";
import Loading from "./Loading";
import "./Search.scss";

interface ISearchResponse {
  resultCount: number;
  results: IFeed[];
}

const SearchResult: React.FC<{
  feed: IFeed;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}> = ({ feed, onClick }) => {
  return (
    <div className="search-result" onClick={onClick}>
      <img src={feed.artworkUrl100} alt="Feed logo" />
      <h3>{feed.collectionName}</h3>
      <span className="artist">{feed.artistName}</span>
      <span className="genre">{feed.primaryGenreName}</span>
    </div>
  );
};

const Search: React.FC<{ onSelect: (feed: IFeed) => void }> = ({
  onSelect
}) => {
  const [query, setQuery] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [results, setResults] = useState<IFeed[]>([]);
  const [entryCounter, setEntryCounter] = useState(0);

  const bufferedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (!bufferedQuery) {
      setResults([]);
      return;
    }

    setLoading(true);
    request
      .get("/api/search?term=" + encodeURIComponent(bufferedQuery))
      .then(res => JSON.parse(res.text))
      .then((res: ISearchResponse) => {
        setResults(res.results);
        setLoading(false);
      })
      .catch((err: Error) => console.error(err));
  }, [bufferedQuery, entryCounter]);

  useEffect(() => {
    const clear = (e: KeyboardEvent) => {
      e.which === 27 && setResults([]);
    };
    document.addEventListener("keydown", clear);
    return () => document.removeEventListener("keydown", clear);
  });

  return (
    <div className="search">
      <div className="search-field">
        <form
          onSubmit={e => {
            e.preventDefault();
            setEntryCounter(entryCounter + 1);
          }}
        >
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setEntryCounter(entryCounter + 1)}
            placeholder="Search"
          />
        </form>
        {isLoading && <Loading small />}
      </div>
      {!!results.length && (
        <div className="search-results">
          {results.slice(0, 10).map(feed => (
            <SearchResult
              key={feed.feedUrl}
              feed={feed}
              onClick={() => {
                setResults([]);
                onSelect(feed);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
