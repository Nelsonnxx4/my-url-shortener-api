import { nanoid } from "nanoid";
import client from "../config/redis";

const TTL = 60 * 60 * 24 * 7;

export const shortenUrl = async (originalUrl: string): Promise<string> => {
	const slug = nanoid(8);
	await client.set(slug, originalUrl, { EX: TTL });
	return slug;
};

export const resolveSlug = async (slug: string): Promise<string | null> => {
	return await client.get(slug);
};

export const getStats = async (slug: string): Promise<number> => {
	const clicks = await client.get(`stats:${slug}`);
	return clicks ? parseInt(clicks) : 0;
};

export const incrementClicks = async (slug: string): Promise<void> => {
	await client.incr(`stats:${slug}`);
};
