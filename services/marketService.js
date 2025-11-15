const axios = require('axios');

let marketDataCache = {
  btcPrice: null,
  lastUpdated: null,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getBtcPrice() {
  if (marketDataCache.btcPrice && Date.now() - marketDataCache.lastUpdated < CACHE_DURATION) {
    return { ...marketDataCache.btcPrice, cached: true };
  }

  const [priceRes, statsRes] = await Promise.all([
    axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'),
    axios.get('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT'),
  ]);

  const btcData = {
    price: parseFloat(priceRes.data.price),
    priceChange: parseFloat(statsRes.data.priceChange),
    priceChangePercent: parseFloat(statsRes.data.priceChangePercent),
    high24h: parseFloat(statsRes.data.highPrice),
    low24h: parseFloat(statsRes.data.lowPrice),
    volume24h: parseFloat(statsRes.data.volume),
    timestamp: new Date().toISOString(),
  };

  marketDataCache = {
    btcPrice: btcData,
    lastUpdated: Date.now(),
  };

  return btcData;
}

function generateMockData(points, interval) {
  const data = [];
  const now = new Date();
  let basePrice = 42000;

  for (let i = points - 1; i >= 0; i--) {
    let date;
    switch (interval) {
      case 'hour':
        date = new Date(now.getTime() - i * 3600000);
        break;
      case 'day':
        date = new Date(now.getTime() - i * 86400000);
        break;
      case 'year':
        date = new Date(now.getFullYear() - i, now.getMonth(), now.getDate());
        break;
      default:
        date = new Date(now.getTime() - i * 86400000);
    }

    const variation = (Math.random() - 0.5) * 0.1;
    const price = basePrice * (1 + variation);
    basePrice = price;

    data.push({
      timestamp: date.toISOString(),
      price: Math.round(price * 100) / 100,
      volume: Math.random() * 1e9 + 5e8,
    });
  }

  return data;
}

function getMockNetworkStats() {
  return {
    hashrate: '525.2 EH/s',
    difficulty: '73.2T',
    blockHeight: 825000,
    nextHalving: {
      estimatedDate: '2028-04-15',
      blocksRemaining: 315000,
    },
    mempool: {
      transactions: 45000,
      size: '125 MB',
    },
    fees: {
      fast: 25,
      medium: 18,
      slow: 12,
    },
  };
}

function getMockAsicProfitability(model) {
  const data = {
    'antminer-s21e-xp-hyd': {
      model: 'Antminer S21E XP Hyd',
      hashrate: 860,
      power: 2880,
      efficiency: 3.35,
      dailyRevenue: 28.5,
      dailyProfit: 18.2,
      monthlyRevenue: 855,
      monthlyProfit: 546,
      electricity: 0.08,
      poolFee: 0.01,
      managementFee: 0.1,
    },
    'whatsminer-m60s-hyd': {
      model: 'Whatsminer M60S+ Hyd',
      hashrate: 900,
      power: 3100,
      efficiency: 3.44,
      dailyRevenue: 29.85,
      dailyProfit: 19.15,
      monthlyRevenue: 895.5,
      monthlyProfit: 574.5,
      electricity: 0.08,
      poolFee: 0.01,
      managementFee: 0.1,
    },
  };

  return model ? data[model] : Object.values(data);
}

module.exports = {
  getBtcPrice,
  generateMockData,
  getMockNetworkStats,
  getMockAsicProfitability,
};
