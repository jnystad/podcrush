import { FC } from "react";
import { useLocation } from "react-router";
import useAckee from "use-ackee";

const Ackee: FC = () => {
  const { pathname } = useLocation();
  useAckee(
    pathname,
    {
      server: "https://stats.nystad.io",
      domainId: "2f6b7bca-6376-4c4e-973a-d7afebfba468",
    },
    {
      ignoreLocalhost: true,
      detailed: false,
    }
  );
  return null;
};

export default Ackee;
