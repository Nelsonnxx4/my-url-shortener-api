import e, { Request, Response, NextFunction } from "express";
import {
	shortenUrl,
	resolveSlug,
	getStats,
	incrementClicks,
} from "../services/url.service";
import { getGithubRepoMeta } from "../services/github.service";
import { renderGithubPreviewPage } from "../utils/og-page";
import { isSocialBot } from "../utils/bot-detector";

export const createShortUrl = async (req: Request, res: Response) => {
	try {
		const { url } = req.body;
		const slug = await shortenUrl(url);
		const shortUrl = `${process.env.BASE_URL || "http://localhost:3000"}/${slug}`;
		res.status(201).json({ shortUrl, slug });
	} catch (err) {
		res.status(500).json({ error: "Failed to shorten URL" });
	}
};

export const redirectUrl = async (req: Request, res: Response) => {
	try {
		const slug = req.params.slug as string;
		const originalUrl = await resolveSlug(slug);

		if (!originalUrl) {
			res.status(404).json({ error: "URL not found or expired" });
			return;
		}

		await incrementClicks(slug);

		if (isSocialBot(req.headers["user-agent"])) {
			const githubMeta = await getGithubRepoMeta(originalUrl);
			if (githubMeta) {
				const shortUrl = `${process.env.BASE_URL || "http://localhost:3000"}/${slug}`;
				res.status(200).type("html").send(renderGithubPreviewPage(shortUrl, githubMeta));
				return;
			}
		}

		res.redirect(301, originalUrl);
	} catch (err) {
		res.status(500).json({ error: "Redirect failed" });
	}
};

export const getUrlStats = async (req: Request, res: Response) => {
	try {
		const slug = req.params.slug as string;

		const original = await resolveSlug(slug);

		if (!original) {
			res.status(404).json({ error: "slug not found " });
			return;
		}

		const clicks = await getStats(slug);
		res.json({ slug, original, clicks });
	} catch (err) {
		res.status(500).json({ error: "failed to get stats" });
	}
};
