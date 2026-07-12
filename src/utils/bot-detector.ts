const BOT_USER_AGENTS = [
	"facebookexternalhit",
	"facebot",
	"twitterbot",
	"slackbot",
	"discordbot",
	"whatsapp",
	"telegrambot",
	"linkedinbot",
	"skypeuripreview",
	"pinterest",
	"redditbot",
	"vkshare",
	"embedly",
	"outlook",
	"applebot",
];

export const isSocialBot = (userAgent?: string): boolean => {
	if (!userAgent) return false;
	const ua = userAgent.toLowerCase();
	return BOT_USER_AGENTS.some((bot) => ua.includes(bot));
};
