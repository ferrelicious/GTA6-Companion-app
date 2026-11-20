import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { NewswireArticle } from '../types';

const ROCKSTAR_RSS_URL = 'https://www.rockstargames.com/newswire/rss';

const FALLBACK_NEWSWIRE_ARTICLES: NewswireArticle[] = [
  {
    id: 'rss-fallback-1',
    title: 'Grand Theft Auto VI: Title Update 01.004.000 — Leonida Performance & Raytracing Notes',
    publishedAt: '2026-11-18',
    summary:
      'Rockstar Games rullar ut optimeringar för 60 fps Performance-läget i Vice Beach och Downtown samt förbättrad trafik- och nätverkssynk för PS5 och Xbox Series X|S.',
    link: 'https://www.rockstargames.com/newswire',
    category: 'Title Update',
    isFallback: true,
  },
  {
    id: 'rss-fallback-2',
    title: 'Välkommen till Leonida: Nya fotoutmaningar & Vice City Community Spotlight',
    publishedAt: '2026-11-12',
    summary:
      'Veckans urval av spelarfoton från Photo Mode över Grassrivers, Ocean Drive och Port Gellhorn samt kommande säsongsaktiviteter.',
    link: 'https://www.rockstargames.com/newswire',
    category: 'Grand Theft Auto VI',
    isFallback: true,
  },
  {
    id: 'rss-fallback-3',
    title: 'Grand Theft Auto VI — Konsolspecifika hotfixar för DualSense & Xbox VRR',
    publishedAt: '2026-11-10',
    summary:
      'Information om de senaste snabbkorrigeringarna för haptisk återkoppling på PlayStation 5 samt VRR- och Dolby Atmos-förbättringar på Xbox Series X|S.',
    link: 'https://www.rockstargames.com/newswire',
    category: 'Title Update',
    isFallback: true,
  },
];

const RELEVANT_KEYWORDS = [
  'gta vi',
  'gta 6',
  'grand theft auto vi',
  'grand theft auto 6',
  'title update',
  'leonida',
  'vice city',
  'patch',
];

function stripHtml(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function formatRssDate(rawDate: string): string {
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) {
    return rawDate.slice(0, 10) || new Date().toISOString().slice(0, 10);
  }
  return parsed.toISOString().slice(0, 10);
}

function parseRockstarRssXml(xmlText: string): NewswireArticle[] {
  if (typeof DOMParser === 'undefined') return [];

  const doc = new DOMParser().parseFromString(xmlText, 'text/xml');
  const parserError = doc.querySelector('parsererror');
  if (parserError) return [];

  const items = Array.from(doc.querySelectorAll('item'));
  const parsed: NewswireArticle[] = [];

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const title = item.querySelector('title')?.textContent?.trim() ?? '';
    const link = item.querySelector('link')?.textContent?.trim() ?? 'https://www.rockstargames.com/newswire';
    const rawDesc = item.querySelector('description')?.textContent ?? '';
    const pubDate = item.querySelector('pubDate')?.textContent?.trim() ?? '';
    const category = item.querySelector('category')?.textContent?.trim() ?? 'Newswire';

    const cleanSummary = stripHtml(rawDesc);
    const haystack = `${title} ${cleanSummary} ${category}`.toLowerCase();

    const isRelevant = RELEVANT_KEYWORDS.some((kw) => haystack.includes(kw));
    if (!isRelevant) continue;

    parsed.push({
      id: `rss-${i}-${link}`,
      title,
      publishedAt: formatRssDate(pubDate),
      summary:
        cleanSummary.length > 200
          ? `${cleanSummary.slice(0, 197).trim()}...`
          : cleanSummary || 'Läs hela artikeln på Rockstar Games Newswire.',
      link,
      category,
      isFallback: false,
    });
  }

  return parsed.slice(0, 5);
}

async function fetchWithTimeout(url: string, timeoutMs = 4500): Promise<string> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.text();
  } finally {
    window.clearTimeout(timer);
  }
}

export interface RssFetchResult {
  articles: NewswireArticle[];
  source: 'edge-function' | 'cors-proxy' | 'fallback';
}

export async function fetchRockstarNewswire(): Promise<RssFetchResult> {
  // 1. Försök via valfri Supabase Edge Function ('rockstar-rss') om Supabase är konfigurerat
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.functions.invoke('rockstar-rss');
      if (!error && data) {
        if (Array.isArray(data.articles) && data.articles.length > 0) {
          return { articles: data.articles, source: 'edge-function' };
        }
        if (typeof data === 'string') {
          const parsed = parseRockstarRssXml(data);
          if (parsed.length > 0) {
            return { articles: parsed, source: 'edge-function' };
          }
        }
      }
    } catch {
      // Fortsätt till CORS-proxy fallback
    }
  }

  // 2. Försök via publika CORS-proxys mot https://www.rockstargames.com/newswire/rss
  const proxyUrls = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(ROCKSTAR_RSS_URL)}`,
    `https://corsproxy.io/?${encodeURIComponent(ROCKSTAR_RSS_URL)}`,
  ];

  for (const proxyUrl of proxyUrls) {
    try {
      const xml = await fetchWithTimeout(proxyUrl, 4500);
      const parsed = parseRockstarRssXml(xml);
      if (parsed.length > 0) {
        return { articles: parsed, source: 'cors-proxy' };
      }
    } catch {
      // Testa nästa proxy eller fall tillbaka till mock-nyheter
    }
  }

  // 3. Fallback om RSS-anropet blockeras i sandbox/förhandsgranskning
  return {
    articles: FALLBACK_NEWSWIRE_ARTICLES,
    source: 'fallback',
  };
}
