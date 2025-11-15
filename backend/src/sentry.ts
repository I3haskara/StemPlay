/*
===========================================================
 SENTRY INITIALIZATION FOR BACKEND (Node + Express)
===========================================================
 - Copilot: This file is imported by routes that want Sentry.
 - It initializes Sentry if SENTRY_DSN is set in backend/.env.
 - Safe in development: if no DSN, it logs and no-ops.
===========================================================
*/

import * as Sentry from "@sentry/node";

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    // For demo / hackathon, full sampling is fine.
    tracesSampleRate: 1.0,
  });
  console.log("[Sentry] Initialized with DSN.");
} else {
  console.log("[Sentry] DSN not set. Sentry is disabled.");
}

export { Sentry };
