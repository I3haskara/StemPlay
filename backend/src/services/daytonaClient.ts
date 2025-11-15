// backend/src/services/daytonaClient.ts
import { Daytona, DaytonaConfig } from '@daytonaio/sdk';

const DAYTONA_API_KEY = process.env.DAYTONA_API_KEY;
if (!DAYTONA_API_KEY) {
  throw new Error("Missing DAYTONA_API_KEY in environment variables");
}

const daytona = new Daytona({
  apiKey: DAYTONA_API_KEY,
  // optionally: apiUrl or target region
});

export async function testSandbox(): Promise<string> {
  const sandbox = await daytona.create({ language: "typescript" });
  try {
    const response = await sandbox.process.codeRun(`
      console.log("Daytona sandbox test run");
      console.log("Time: " + new Date().toISOString());
    `);
    if (response.exitCode !== 0) {
      console.error("Sandbox run error:", response.exitCode, response.result);
      return `Error code: ${response.exitCode}`;
    }
    return response.result;
  } finally {
    await sandbox.delete();
  }
}
