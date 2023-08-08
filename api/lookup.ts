import type { VercelRequest, VercelResponse } from "@vercel/node";
import request from "superagent";

module.exports = (req: VercelRequest, res: VercelResponse) => {
  request
    .get("https://itunes.apple.com/lookup?id=" + req.query.id)
    .then((r) => {
      res.removeHeader("Cache-Control");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.setHeader("Content-Type", "application/json");
      res.send(r.text);
    })
    .catch(() => res.status(500));
};
