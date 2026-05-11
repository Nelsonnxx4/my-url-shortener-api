import { Router } from "express";
import {
	createShortUrl,
	redirectUrl,
	getUrlStats,
} from "../controllers/url.controller";
import { validateUrl } from "../middleware/validate";

const router = Router();

router.post("/shorten", validateUrl, createShortUrl);
router.get("/:slug", redirectUrl);
router.get("/:slug/stats", getUrlStats);

export default router;
