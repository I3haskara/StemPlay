import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import parseDocumentRoute from "./routes/parseDocument.js";
import youtubeParseRoute from "./routes/youtubeParse.js";
// import sentryDemoRoute from "./routes/sentryDemo.js";

const app = express();
const PORT = process.env.PORT || 3001;

/*
===========================================================
 EXPRESS SERVER CONFIG
===========================================================
 - CORS: allow Vite dev server on http://localhost:5173 & 5174
 - Routes:
    /api/health         : basic health check
    /api/parse-document : Daytona-powered formula parser
    /api/youtube-parse  : YouTube transcript parser
    /api/sentry-demo    : triggers Sentry error for demo
===========================================================
*/

// Allow frontend dev server to call backend
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // support both Vite ports
  })
);

app.use(bodyParser.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Backend up" });
});

// Daytona-powered route
app.use("/api", parseDocumentRoute);

// YouTube parser route
app.use("/api", youtubeParseRoute);

// Sentry demo endpoint
// app.use("/api", sentryDemoRoute);

app.listen(PORT, () => {
  console.log("Backend running on port " + PORT);
});
