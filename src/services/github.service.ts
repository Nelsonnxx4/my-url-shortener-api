import client from "../config/redis";

const GITHUB_REPO_REGEX = /^https?:\/\/(www\.)?github\.com\/([^\/]+)\/([^\/]+)\/?$/;

const CACHE_TTL = 60 * 60;

export interface GithubRepoMeta {
	fullName: string;
	description: string | null;
	ownerAvatar: string;
	stars: number;
	url: string;
}

export const parseGithubRepoUrl = (
	url: string,
): { owner: string; repo: string } | null => {
	const match = url.match(GITHUB_REPO_REGEX);
	if (!match) return null;
	return { owner: match[2], repo: match[3].replace(/\.git$/, "") };
};

export const getGithubRepoMeta = async (
	url: string,
): Promise<GithubRepoMeta | null> => {
	const parsed = parseGithubRepoUrl(url);
	if (!parsed) return null;

	const cacheKey = `gh-meta:${parsed.owner}/${parsed.repo}`;
	const cached = await client.get(cacheKey);
	if (cached) return JSON.parse(cached);

	try {
		const res = await fetch(
			`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`,
			{
				headers: {
					Accept: "application/vnd.github+json",
					"User-Agent": "my-url-shortener",
				},
			},
		);
		if (!res.ok) return null;

		const data = (await res.json()) as {
			full_name: string;
			description: string | null;
			stargazers_count: number;
			owner?: { avatar_url: string };
		};

		const meta: GithubRepoMeta = {
			fullName: data.full_name,
			description: data.description,
			ownerAvatar: data.owner?.avatar_url ?? "",
			stars: data.stargazers_count ?? 0,
			url,
		};

		await client.set(cacheKey, JSON.stringify(meta), { EX: CACHE_TTL });
		return meta;
	} catch {
		return null;
	}
};
