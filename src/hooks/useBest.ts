import { useState, useEffect } from "react";
import request from "superagent";

interface IListenPodcast {
  itunes_id: number;
}

interface ISearchResponse {
  resultCount: number;
  podcasts: IListenPodcast[];
}

const cache: { [region: string]: IListenPodcast[] } = {};

export default function useBest(region: string = "us") {
  const [results, setResults] = useState<IListenPodcast[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (region in cache) {
      setResults(cache[region]);
      return;
    }

    setLoading(true);
    const req = request.get(`/api/best?region=${region}`);

    req
      .then((res) => res.body)
      .then((res: ISearchResponse) => {
        cache[region] = res.podcasts;
        setResults(res.podcasts);
        setLoading(false);
      })
      .catch((err) => {
        if (err.code && err.code === "ABORTED") return;
        console.error(err);
      });

    return () => req.abort();
  }, [region]);

  return { best: results, isLoading };
}
