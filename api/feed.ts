import type { VercelRequest, VercelResponse } from "@vercel/node";
const request = require("superagent");

module.exports = (req: VercelRequest, res: VercelResponse) => {
  request
    .get("https://itunes.apple.com/lookup?id=" + req.query.id)
    .then((r) => {
      const feed = JSON.parse(r.text);
      request
        .get(feed.results[0].feedUrl)
        .buffer()
        .then((r) => {
          res.removeHeader("Cache-Control");
          res.setHeader("Cache-Control", "public, max-age=86400");
          res.setHeader("Content-Type", "application/rss+xml");
          res.send(r.text);
        })
        .catch(() => res.status(500));
    })
    .catch(() => res.status(500));
};
