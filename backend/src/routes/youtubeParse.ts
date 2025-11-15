import express from "express";
import { YoutubeTranscript } from "youtube-transcript";
import axios from "axios";

const router = express.Router();

/*
============================================================
  /api/youtube-parse
  Input: { url: "https://youtube.com/watch?v=xxxx" }
  Output:
    - transcriptText
    - formulas (from Daytona)
    - suggestedSimulation
============================================================
*/

router.post("/youtube-parse", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !url.includes("youtube.com")) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    // Extract video ID
    const id = new URL(url).searchParams.get("v");
    if (!id) {
      return res.status(400).json({ error: "Invalid YouTube video ID" });
    }

    // 1) GET TRANSCRIPT
    const transcript = await YoutubeTranscript.fetchTranscript(id);
    const transcriptText = transcript.map((t: any) => t.text).join(" ");

    // 2) SEND TO DAYTONA PARSER
    const daytonaResponse = await axios.post(
      "http://localhost:3001/api/parse-document",
      { text: transcriptText }
    );

    const formulas = daytonaResponse.data.parsed?.formulas || [];

    // 3) SUGGESTED SIMULATION
    let suggestedSimulation = null;

    if (formulas.length > 0) {
      const f = formulas[0]; // take first formula
      suggestedSimulation = {
        formula: f.formula,
        variables: f.variables || [],
        suggestion: `Try simulating the formula ${f.formula} by adjusting its variables in the Simulation Lab.`,
      };
    }

    return res.json({
      transcriptText,
      formulas,
      suggestedSimulation,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "YouTube parse error" });
  }
});

export default router;
