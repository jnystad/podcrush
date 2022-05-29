import { NowRequest, NowResponse } from "@now/node";
import request from "superagent";

module.exports = (req: NowRequest, res: NowResponse) => {
  request
    .get(
      "https://listen-api.listennotes.com/api/v2/best_podcasts?page=1&safe_mode=0&region=" +
        (req.query.region || "us")
    )
    .set("X-ListenAPI-Key", process.env.X_LISTENAPI_KEY ?? "")
    .then((r) => {
      res.removeHeader("Cache-Control");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.setHeader("Content-Type", "application/json");
      res.send(r.text);
    })
    .catch(() => res.status(500));
};
