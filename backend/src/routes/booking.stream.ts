import { Router } from "express";
import { addClient, removeClient } from "../lib/broadcaster";

const router = Router();

router.get("/stream", (req, res) => {
  // الهيدر الخاص بـ SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  addClient(res);

  // تنظيف عند انقطاع العميل
  req.on("close", () => {
    removeClient(res);
  });
});

export default router;
