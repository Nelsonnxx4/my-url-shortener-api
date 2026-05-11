import { Request, Response, NextFunction } from "express";

export const validateUrl = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { url } = req.body;

	if (!url || typeof url !== "string") {
		res.status(400).json({ error: "URL is required" });
		return;
	}

	try {
		new URL(url);
		next();
	} catch {
		res.status(400).json({ error: "Invalid URL format" });
	}
};
