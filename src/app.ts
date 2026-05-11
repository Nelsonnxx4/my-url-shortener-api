import express from "express";
import dotenv from "dotenv";
import { connectRedis } from "./config/redis";
import urlRoutes from "./routes/url.routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/", urlRoutes);

const PORT = process.env.PORT || 3000;

const start = async () => {
	await connectRedis();
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();

export default app;
