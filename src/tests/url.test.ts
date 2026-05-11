import request from "supertest";
import app from "../app";
import client from "../config/redis";
import { beforeAll, afterAll, describe, it, expect } from "@jest/globals";

beforeAll(async () => {
	await client.connect();
});

afterAll(async () => {
	await client.quit();
});

describe("POST /shorten", () => {
	it("should create a short URL", async () => {
		const response = await request(app)
			.post("/shorten")
			.send({ url: "https://www.example.com" });

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("shortUrl");
		expect(response.body).toHaveProperty("slug");
	});

	it("rejects missing URL", async () => {
		const response = await request(app).post("/shorten").send({});

		expect(response.status).toBe(400);
	});

	it("rejects invalid URL", async () => {
		const response = await request(app)
			.post("/shorten")
			.send({ url: "not-a-valid-url" });

		expect(response.status).toBe(400);
	});
});

describe("GET /:slug", () => {
	it("should redirect to original URL", async () => {
		const { body } = await request(app)
			.post("/shorten")
			.send({ url: "https://www.example.com" });

		const { slug } = body;

		const response = await request(app).get(`/${slug}`);
		expect(response.status).toBe(301);
		expect(response.headers.location).toBe("https://www.example.com");
	});

	it("returns 404 for non-existent slug", async () => {
		const response = await request(app).get("/nonexistent");
		expect(response.status).toBe(404);
	});
});

describe("GET /stats/:slug", () => {
	it("should return stats for a valid slug", async () => {
		const { body } = await request(app)
			.post("/shorten")
			.send({ url: "https://www.example.com" });

		const { slug } = body;

		await request(app).get(`/${slug}`);

		const response = await request(app).get(`/stats/${slug}`);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("slug", slug);
		expect(response.body).toHaveProperty("original", "https://www.example.com");
		expect(response.body).toHaveProperty("clicks", 1);
	});

	it("returns 404 for non-existent slug", async () => {
		const response = await request(app).get("/stats/nonexistent");
		expect(response.status).toBe(404);
	});
});
