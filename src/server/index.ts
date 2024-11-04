import express from 'express';
import cors from 'cors';
import { Connection } from '@solana/web3.js';
import { GridService } from '../services/gridService';
import { MarketService } from '../services/marketService';
import { RewardsService } from '../services/rewardsService';
import { initializeSVM } from './svm';
import { setupDataAvailability } from './dataAvailability';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SOON Stack components
const connection = new Connection(process.env.SOLANA_RPC_URL || 'http://localhost:8899');
const svm = initializeSVM();
const dataLayer = setupDataAvailability('celestia'); // or 'eigenDA' or 'avail'

// Initialize services
const gridService = new GridService(connection, svm.program);
const marketService = new MarketService(connection, svm.program);
const rewardsService = new RewardsService(connection, svm.program);

// API Routes
app.get('/api/grid/metrics', async (req, res) => {
  try {
    const metrics = await gridService.getGridMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch grid metrics' });
  }
});

app.get('/api/market/offers', async (req, res) => {
  try {
    const offers = await marketService.getActiveOffers();
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market offers' });
  }
});

app.post('/api/market/offers', async (req, res) => {
  try {
    const { kwhAmount, pricePerKwh } = req.body;
    const tx = await marketService.createEnergyOffer(kwhAmount, pricePerKwh);
    res.json({ transaction: tx });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create offer' });
  }
});

app.post('/api/rewards/contribute', async (req, res) => {
  try {
    const { kwhAmount } = req.body;
    const tx = await rewardsService.contributeEnergy(kwhAmount);
    res.json({ transaction: tx });
  } catch (error) {
    res.status(500).json({ error: 'Failed to contribute energy' });
  }
});

app.get('/api/rewards/:address', async (req, res) => {
  try {
    const rewards = await rewardsService.getUserRewards(req.params.address);
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user rewards' });
  }
});

app.listen(PORT, () => {
  console.log(`SOON Stack backend running on port ${PORT}`);
});