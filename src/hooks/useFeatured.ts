import { useMemo } from "react";
import useFeed from "./useFeed";
import { IFeed } from "../types";

export default function useFeatured() {
  const all = [
    useFeed(1503412182).feed,
    useFeed(1500919715).feed,
    useFeed(1200361736).feed,
    useFeed(1112190608).feed,
    useFeed(1350257200).feed,
    useFeed(1382999024).feed,
    useFeed(1044196249).feed,
    useFeed(1212558767).feed
  ];

  const featured: IFeed[] = useMemo(
    () => all.filter(feed => feed != null) as IFeed[],
    [all]
  );

  const isLoading = useMemo(() => all.length !== featured.length, [
    all,
    featured
  ]);

  return { featured, isLoading };
}
