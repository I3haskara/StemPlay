/*
===========================================================
 /api/sentry-demo  —  Sentry Test Endpoint
===========================================================
 - Hit this route from browser or frontend to generate
   a controlled error and send it to Sentry.
 - For demo video: open Sentry dashboard and show this event.
===========================================================
*/

import { Router, Request, Response } from "express";
import { Sentry } from "../sentry.js";

const router = Router();

router.get("/sentry-demo", (_req: Request, res: Response) => {
  try {
    // Intentional error for Sentry demo
    throw new Error("STEMPlay AI — Sentry demo error from /api/sentry-demo");
  } catch (err) {
    // Send to Sentry if DSN is configured
    try {
      if (Sentry) {
        Sentry.captureException(err);
      }
    } catch (innerErr) {
      console.error("[Sentry] captureException failed:", innerErr);
    }

    // Respond normally so the UI doesn't crash
    res.json({
      ok: true,
      message: "Sentry demo error captured (check your Sentry dashboard).",
    });
  }
});

export default router;
