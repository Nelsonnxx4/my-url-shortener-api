import { GithubRepoMeta } from "../services/github.service";

const escapeHtml = (value: string): string =>
	value
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");

export const renderGithubPreviewPage = (
	shortUrl: string,
	meta: GithubRepoMeta,
): string => {
	const title = meta.fullName;
	const description =
		meta.description || `Check out ${meta.fullName} on GitHub — ${meta.stars} stars.`;

	return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<meta property="og:type" content="website" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${escapeHtml(meta.ownerAvatar)}" />
<meta property="og:url" content="${escapeHtml(shortUrl)}" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${escapeHtml(meta.ownerAvatar)}" />
<meta http-equiv="refresh" content="0;url=${escapeHtml(meta.url)}" />
</head>
<body>
<p>Redirecting to <a href="${escapeHtml(meta.url)}">${escapeHtml(meta.fullName)}</a>&hellip;</p>
</body>
</html>`;
};
