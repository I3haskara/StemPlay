import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import parseDocumentRoute from "./routes/parseDocument.js";
import youtubeParseRoute from "./routes/youtubeParse.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Allow frontend dev server to call backend
app.use(
  cors({
    origin: "http://localhost:5174", // your Vite dev URL
  })
);

app.use(bodyParser.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Backend up" });
});

// Daytona-powered route
app.use("/api", parseDocumentRoute);

// NEW: YouTube parser route
app.use("/api", youtubeParseRoute);

app.listen(PORT, () => {
  console.log("Backend running on port " + PORT);
});
