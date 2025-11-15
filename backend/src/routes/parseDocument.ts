import { Router, Request, Response } from "express";
import { Daytona } from "@daytonaio/sdk";

const router = Router();

const DAYTONA_API_KEY = process.env.DAYTONA_API_KEY;
if (!DAYTONA_API_KEY) {
  throw new Error("Missing DAYTONA_API_KEY in environment variables");
}

const daytona = new Daytona({ apiKey: DAYTONA_API_KEY });

router.post("/parse-document", async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (typeof text !== "string" || text.trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid text payload" });
    }

    const sandbox = await daytona.create({ language: "typescript" });

    try {
      const safeText = text.replace(/`/g, "\\`");

      const promptCode = `
        const inputText = \`${safeText}\`;

        const formulas: any[] = [];

        // Very naive pattern check — you can improve this later
        if (inputText.includes("F = m") && inputText.includes("g")) {
          formulas.push({
            formula: "F = m · g",
            variables: ["F", "m", "g"],
            description: "Force equals mass times gravitational acceleration."
          });
        }

        // You can add more heuristics here for other formulas

        console.log(JSON.stringify({ formulas }));
      `;

      const response = await sandbox.process.codeRun(promptCode);

      if (response.exitCode !== 0) {
        console.warn(
          "Daytona sandbox returned non-zero exit code",
          response.exitCode,
          response.result
        );
        return res.status(500).json({
          success: false,
          error: "Sandbox execution error",
          details: response.result,
        });
      }

      const resultText = response.result.trim();
      let parsed: any = { formulas: [] };

      try {
        parsed = JSON.parse(resultText);
      } catch (e) {
        console.warn("Failed to parse JSON from sandbox result:", resultText);
      }

      return res.json({ success: true, parsed, raw: resultText });
    } finally {
      await sandbox.delete();
    }
  } catch (error) {
    console.error("[parse-document] error:", error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

export default router;
