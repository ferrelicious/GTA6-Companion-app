export const APP_VERSION =
  (import.meta.env.VITE_APP_VERSION as string | undefined)?.trim() || '1.0.0';

const DEFAULT_GITHUB_REPO = 'DITT_ANVANDARNAMN/DITT_REPO';

export function getConfiguredGithubRepo(): string {
  const envRepo = (import.meta.env.VITE_GITHUB_REPO as string | undefined)?.trim();
  return envRepo && envRepo.includes('/') ? envRepo : DEFAULT_GITHUB_REPO;
}

export function isGithubRepoConfigured(): boolean {
  const repo = getConfiguredGithubRepo();
  return Boolean(repo && repo !== DEFAULT_GITHUB_REPO && !repo.includes('DITT_ANVANDARNAMN'));
}

export interface GithubReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
  content_type?: string;
}

export interface GithubReleaseResponse {
  tag_name: string;
  name: string | null;
  body: string | null;
  html_url: string;
  published_at: string;
  assets: GithubReleaseAsset[];
}

export interface UpdateCheckResult {
  currentVersion: string;
  latestVersion: string;
  releaseTitle: string;
  releaseNotes: string;
  publishedAt: string;
  releaseUrl: string;
  apkDownloadUrl: string | null;
  apkName: string | null;
  apkSizeBytes: number | null;
  hasUpdate: boolean;
  repo: string;
}

function normalizeVersion(raw: string): number[] {
  const cleaned = raw.trim().replace(/^v/i, '').split('-')[0];
  return cleaned.split('.').map((part) => {
    const num = Number.parseInt(part.replace(/\D/g, ''), 10);
    return Number.isFinite(num) ? num : 0;
  });
}

export function isNewerVersion(latest: string, current: string): boolean {
  const a = normalizeVersion(latest);
  const b = normalizeVersion(current);
  const maxLen = Math.max(a.length, b.length, 3);
  for (let i = 0; i < maxLen; i += 1) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    if (av > bv) return true;
    if (av < bv) return false;
  }
  return false;
}

export function formatBytes(bytes: number | null): string {
  if (!bytes || bytes <= 0) return '';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

export async function checkForAppUpdate(): Promise<UpdateCheckResult> {
  const repo = getConfiguredGithubRepo();
  const endpoint = `https://api.github.com/repos/${repo}/releases/latest`;

  const response = await fetch(endpoint, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('UPDATE_REPO_NOT_FOUND');
    }
    if (response.status === 403 || response.status === 429) {
      throw new Error('UPDATE_RATE_LIMIT');
    }
    throw new Error(`UPDATE_HTTP_${response.status}`);
  }

  const data = (await response.json()) as GithubReleaseResponse;
  const latestVersion = (data.tag_name || '').replace(/^v/i, '') || APP_VERSION;
  const apkAsset =
    Array.isArray(data.assets) &&
    data.assets.find((asset) => asset.name.toLowerCase().endsWith('.apk'));

  return {
    currentVersion: APP_VERSION,
    latestVersion,
    releaseTitle: data.name?.trim() || `v${latestVersion}`,
    releaseNotes: data.body?.trim() || '',
    publishedAt: data.published_at ? data.published_at.slice(0, 10) : '',
    releaseUrl: data.html_url,
    apkDownloadUrl: apkAsset ? apkAsset.browser_download_url : null,
    apkName: apkAsset ? apkAsset.name : null,
    apkSizeBytes: apkAsset ? apkAsset.size : null,
    hasUpdate: isNewerVersion(latestVersion, APP_VERSION),
    repo,
  };
}
