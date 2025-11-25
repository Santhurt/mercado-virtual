import request from "supertest";
import app from "../app.js";

const buildUserPayload = (overrides = {}) => ({
    fullName: "Juan Tester",
    email: "juan@test.com",
    password: "Password123",
    documentNumber: "1234567890",
    age: 30,
    phone: "3001234567",
    ...overrides,
});

describe("User endpoints", () => {
    test("registers a user and returns JWT", async () => {
        const response = await request(app).post("/api/users/register").send(buildUserPayload());

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.user.email).toBe("juan@test.com");
        expect(response.body.data.token).toBeDefined();
    });

    test("logs in an existing user", async () => {
        await request(app).post("/api/users/register").send(buildUserPayload());

        const response = await request(app)
            .post("/api/users/login")
            .send({ email: "juan@test.com", password: "Password123" });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.token).toBeDefined();
    });

    test("lists users with pagination metadata", async () => {
        await request(app).post("/api/users/register").send(buildUserPayload());
        await request(app)
            .post("/api/users/register")
            .send(buildUserPayload({ email: "ana@test.com", documentNumber: "1234567891" }));

        const response = await request(app).get("/api/users").query({ page: 1, limit: 10 });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.users).toHaveLength(2);
        expect(response.body.data.pagination.total).toBe(2);
    });

    test("updates a user profile", async () => {
        const { body } = await request(app).post("/api/users/register").send(buildUserPayload());
        const userId = body.data.user._id;

        const response = await request(app).put(`/api/users/${userId}`).send({ phone: "3007654321", age: 35 });

        expect(response.status).toBe(200);
        expect(response.body.data.phone).toBe("3007654321");
        expect(response.body.data.age).toBe(35);
    });

    test("deletes a user", async () => {
        const { body } = await request(app).post("/api/users/register").send(buildUserPayload());
        const userId = body.data.user._id;

        const response = await request(app).delete(`/api/users/${userId}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/eliminado/i);
    });

    test("rejects registration without required fields", async () => {
        const response = await request(app).post("/api/users/register").send({ email: "invalid@test.com" });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.missingFields).toContain("fullName");
    });
});

