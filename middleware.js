// Vercel Edge Middleware
// 负责实时捕获进站真实搜索引擎/AI爬虫与真人浏览器引流访客

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

const COUNTRY_NAMES = {
  CN: '中国',
  US: '美国',
  IN: '印度',
  EC: '厄瓜多尔',
  GB: '英国',
  DE: '德国',
  JP: '日本',
  KR: '韩国',
  CA: '加拿大',
  AU: '澳大利亚',
  FR: '法国',
  SG: '新加坡',
  HK: '中国香港',
  TW: '中国台湾'
};

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

function identifyReferrer(referrerUrl) {
  if (!referrerUrl) return '直接访问';
  try {
    const url = new URL(referrerUrl);
    const host = url.hostname.toLowerCase();
    if (host.includes('google.')) return 'Google';
    if (host.includes('chatgpt.com') || host.includes('openai.com')) return 'ChatGPT';
    if (host.includes('bing.com') || host.includes('perplexity.ai')) return 'Bing、Perplexity';
    if (host.includes('twitter.com') || host.includes('x.com')) return 'Twitter/X';
    return host;
  } catch {
    return '直接访问';
  }
}

export const config = {
  matcher: [
    /*
     * 匹配除常见静态媒体文件与 assets 之外的所有请求
     */
    '/((?!assets/|_next/|.*\\.(?:jpg|jpeg|gif|png|webp|svg|ico|css|js|woff|woff2)).*)',
  ],
};

export default async function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 内部接口不进行统计拦截
  if (pathname.startsWith('/api/') || pathname.startsWith('/__stats')) {
    return;
  }

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 如果尚未配置 Redis，跳过写入避免阻断
  if (!redisUrl || !redisToken) {
    return;
  }

  const ua = request.headers.get('user-agent') || '';
  const referrer = request.headers.get('referer') || '';
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
  const geoCountryCode = request.geo?.country || '';
  const countryName = COUNTRY_NAMES[geoCountryCode] || geoCountryCode || '海外';
  const bj = getBeijingTime();

  const isRobots = pathname === '/robots.txt';
  const isSitemap = pathname === '/sitemap.xml';
  const isIndexNow = pathname.toLowerCase().includes('indexnow');
  const isPage = !isRobots && !isSitemap && !isIndexNow && (pathname === '/' || pathname.endsWith('.html') || !pathname.includes('.'));

  // 1. 检查是否为已知爬虫
  let matchedBot = null;
  for (const bot of KNOWN_BOTS) {
    if (bot.match.test(ua)) {
      matchedBot = bot;
      break;
    }
  }

  // 异步任务：写入 Redis
  const trackPromise = (async () => {
    try {
      // 读取现有数据
      const getRes = await fetch(`${redisUrl}/get/krillion_crawler_analytics`, {
        headers: { Authorization: `Bearer ${redisToken}` }
      });
      const getJson = await getRes.json();
      let stats = { bots: {}, visitors: {}, visitorIps: {}, initTime: bj.full };
      if (getJson && getJson.result) {
        stats = typeof getJson.result === 'string' ? JSON.parse(getJson.result) : getJson.result;
      }

      let hasChanges = false;

      // A. 处理爬虫
      if (matchedBot) {
        if (!stats.bots) stats.bots = {};
        let actionTag = '';
        if (isRobots) actionTag = '（只读 robots.txt）';
        else if (isSitemap) actionTag = '（只读 sitemap）';
        else if (isIndexNow) actionTag = '（只读 IndexNow key 文件）';

        if (!stats.bots[matchedBot.id]) {
          stats.bots[matchedBot.id] = {
            name: matchedBot.name,
            firstSeen: bj.full,
            actionNote: actionTag,
            firstPageSeen: isPage ? '同时' : null,
            dailyPages: {}
          };
          hasChanges = true;
        }

        const botRecord = stats.bots[matchedBot.id];
        if (isPage) {
          if (!botRecord.firstPageSeen) {
            botRecord.firstPageSeen = (botRecord.firstSeen === bj.full && !botRecord.actionNote) ? '同时' : bj.full;
          }
          botRecord.dailyPages[bj.day] = (botRecord.dailyPages[bj.day] || 0) + 1;
          hasChanges = true;
        } else {
          if (!botRecord.firstPageSeen && !botRecord.actionNote) {
            botRecord.actionNote = actionTag;
            hasChanges = true;
          }
        }
      } 
      // B. 处理真人浏览器访客 (UV 去重)
      else {
        const isBrowser = /mozilla/i.test(ua) && !/bot|spider|crawl|slurp|curl|wget|python|headless/i.test(ua);
        if (isBrowser && isPage) {
          if (!stats.visitors) stats.visitors = {};
          if (!stats.visitorIps) stats.visitorIps = {};

          const source = identifyReferrer(referrer);
          const landingPath = pathname === '/' ? '首页' : pathname;

          if (!stats.visitors[source]) {
            stats.visitors[source] = {
              firstVisitor: {
                time: bj.full,
                country: countryName,
                path: landingPath
              },
              dailyCounts: {}
            };
            hasChanges = true;
          }

          const uvKey = `${source}:${bj.day}`;
          if (!stats.visitorIps[uvKey]) {
            stats.visitorIps[uvKey] = [];
          }

          if (!stats.visitorIps[uvKey].includes(ip)) {
            stats.visitorIps[uvKey].push(ip);
            const vRecord = stats.visitors[source];
            vRecord.dailyCounts[bj.day] = (vRecord.dailyCounts[bj.day] || 0) + 1;
            hasChanges = true;
          }
        }
      }

      if (hasChanges) {
        stats.lastUpdated = bj.dateStr;
        stats.isConfigured = true;
        await fetch(`${redisUrl}/set/krillion_crawler_analytics`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${redisToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(JSON.stringify(stats))
        });
      }
    } catch (e) {
      console.error('Middleware logging failed:', e);
    }
  })();

  // 边缘非阻塞异步执行
  if (typeof request.waitUntil === 'function') {
    request.waitUntil(trackPromise);
  }
}
