import express from 'express';
import { testSandbox } from './services/daytonaClient';

const app = express();

app.use(express.json());

app.get('/api/daytona-test', async (req, res) => {
  try {
    const result = await testSandbox();
    res.json({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: String(error) });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
