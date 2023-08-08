import type { VercelRequest, VercelResponse } from "@vercel/node";
import request from "superagent";

export default function handler(req: VercelRequest, res: VercelResponse) {
  request
    .get("https://itunes.apple.com/search?media=podcast&term=" + req.query.term)
    .then((r) => {
      res.removeHeader("Cache-Control");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.setHeader("Content-Type", "application/json");
      res.send(r.text);
    })
    .catch(() => res.status(500));
}
