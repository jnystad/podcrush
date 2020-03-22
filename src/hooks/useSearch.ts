import { useState, useEffect, useCallback } from "react";
import useDebounce from "./useDebounce";
import { IFeed } from "../types";
import request from "superagent";

interface ISearchResponse {
  resultCount: number;
  results: IFeed[];
}

export default function useSearch(query: string) {
  const [results, setResults] = useState<IFeed[]>([]);
  const [isLoading, setLoading] = useState(false);

  const bufferedQuery = useDebounce(query, 500);

  const load = useCallback(() => {
    if (!bufferedQuery) {
      setResults([]);
      return;
    }

    setLoading(true);
    const req = request.get(
      "/api/search?term=" + encodeURIComponent(bufferedQuery)
    );

    req
      .then(res => JSON.parse(res.text))
      .then((res: ISearchResponse) => {
        setResults(res.results);
        setLoading(false);
      })
      .catch(err => {
        if (err.code && err.code === "ABORTED") return;
        console.error(err);
      });

    return () => req.abort();
  }, [bufferedQuery]);

  useEffect(load, [load]);

  const reset = useCallback(() => setResults([]), []);

  return { results, isLoading, reset, load };
}
