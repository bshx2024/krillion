// Vercel Serverless Function: /api/__stats
// 提供真实爬虫与访客监控数据的查询与更新接口

const KNOWN_BOTS = [
  { id: 'googlebot', name: 'Googlebot', match: /googlebot/i, orgMatch: /google/i },
  { id: 'oai-searchbot', name: 'OAI-SearchBot（ChatGPT 搜索索引）', match: /oai-searchbot/i, orgMatch: /openai|microsoft/i },
  { id: 'bingbot', name: 'Bingbot', match: /bingbot/i, orgMatch: /microsoft/i },
  { id: 'applebot', name: 'Applebot', match: /applebot/i, orgMatch: /apple/i },
  { id: 'claudebot', name: 'ClaudeBot', match: /claudebot|anthropic-ai/i, orgMatch: /anthropic|amazon/i },
  { id: 'chatgpt-user', name: 'ChatGPT-User（ChatGPT 替用户读网页）', match: /chatgpt-user/i, orgMatch: /openai|microsoft/i },
  { id: 'gptbot', name: 'GPTBot', match: /gptbot/i, orgMatch: /openai|microsoft/i },
  { id: 'perplexity', name: 'PerplexityBot', match: /perplexitybot/i, orgMatch: /perplexity/i }
];

function getBeijingTime(date = new Date()) {
  const beijingTime = new Date(date.getTime() + (8 * 60 + date.getTimezoneOffset()) * 60000);
  const pad = (n) => String(n).padStart(2, '0');
  const m = pad(beijingTime.getMonth() + 1);
  const d = pad(beijingTime.getDate());
  const h = pad(beijingTime.getHours());
  const min = pad(beijingTime.getMinutes());
  return {
    full: `${m}-${d} ${h}:${min}`,
    day: `${m}-${d}`,
    dateStr: `${beijingTime.getFullYear()}-${m}-${d} ${h}:${min}`
  };
}

// 内存暂存（当未配置 Redis 时提供单实例临时会话演示）
let inMemoryStats = {
  isConfigured: false,
  bots: {},
  visitors: {},
  visitorIps: {},
  initTime: getBeijingTime().full,
  lastUpdated: getBeijingTime().dateStr
};

async function getStatsFromRedis() {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    return { ...inMemoryStats, isConfigured: false };
  }

  try {
    const res = await fetch(`${redisUrl}/get/krillion_crawler_analytics`, {
      headers: { Authorization: `Bearer ${redisToken}` }
    });
    const data = await res.json();
    if (data && data.result) {
      const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
      return { ...parsed, isConfigured: true };
    }
  } catch (err) {
    console.error('Failed to read from Upstash Redis:', err);
  }

  return { ...inMemoryStats, isConfigured: true };
}

async function saveStatsToRedis(stats) {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  inMemoryStats = stats;

  if (!redisUrl || !redisToken) {
    return false;
  }

  try {
    const payload = JSON.stringify({ ...stats, isConfigured: true });
    await fetch(`${redisUrl}/set/krillion_crawler_analytics`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redisToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    return true;
  } catch (err) {
    console.error('Failed to save to Upstash Redis:', err);
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. 测试上报入口（供站长一键调试模拟爬虫与真人）
  if (req.method === 'POST') {
    const body = req.body || {};
    const stats = await getStatsFromRedis();
    const bj = getBeijingTime();

    if (body.action === 'mock_bot') {
      const bot = KNOWN_BOTS.find(b => b.id === body.botId) || KNOWN_BOTS[0];
      if (!stats.bots) stats.bots = {};
      if (!stats.bots[bot.id]) {
        stats.bots[bot.id] = {
          name: bot.name,
          firstSeen: bj.full,
          actionNote: body.actionNote || '',
          firstPageSeen: body.firstPageSeen || '同时',
          dailyPages: {}
        };
      }
      stats.bots[bot.id].dailyPages[bj.day] = (stats.bots[bot.id].dailyPages[bj.day] || 0) + 1;
      stats.lastUpdated = bj.dateStr;
      await saveStatsToRedis(stats);
      return res.status(200).json({ ok: true, stats });
    }

    if (body.action === 'mock_visitor') {
      const source = body.source || 'Google';
      if (!stats.visitors) stats.visitors = {};
      if (!stats.visitors[source]) {
        stats.visitors[source] = {
          firstVisitor: {
            time: bj.full,
            country: body.country || '美国',
            path: '首页'
          },
          dailyCounts: {}
        };
      }
      stats.visitors[source].dailyCounts[bj.day] = (stats.visitors[source].dailyCounts[bj.day] || 0) + 1;
      stats.lastUpdated = bj.dateStr;
      await saveStatsToRedis(stats);
      return res.status(200).json({ ok: true, stats });
    }

    if (body.action === 'reset') {
      const fresh = {
        isConfigured: Boolean(process.env.UPSTASH_REDIS_REST_URL),
        bots: {},
        visitors: {},
        visitorIps: {},
        initTime: bj.full,
        lastUpdated: bj.dateStr
      };
      await saveStatsToRedis(fresh);
      return res.status(200).json({ ok: true, stats: fresh });
    }
  }

  // 2. 默认 GET: 返回统计数据
  const stats = await getStatsFromRedis();
  return res.status(200).json(stats);
}
