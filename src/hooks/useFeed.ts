import { useState, useEffect } from "react";
import { IFeed } from "../types";
import request from "superagent";

interface ISearchResponse {
  resultCount: number;
  results: IFeed[];
}

export default function useFeed(id: number) {
  const [feed, setFeed] = useState<IFeed | null>(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setFeed(null);
      return;
    }

    setLoading(true);
    const req = request.get("/api/lookup?id=" + encodeURIComponent(id));

    req
      .then((res) => res.body)
      .then((res: ISearchResponse) => {
        setFeed(res.results[0]);
        setLoading(false);
      })
      .catch((err) => {
        if (err.code && err.code === "ABORTED") return;
        console.error(err);
      });

    return () => req.abort();
  }, [id]);

  return { feed, isLoading };
}
