declare module "use-ackee" {
  export default function useAckee(
    pathname?: string,
    server: { server: string; domainId: string },
    options?: { ignoreLocalhost?: bool; detailed?: bool }
  );
}
