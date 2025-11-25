import request from "supertest";
import app from "../app.js";

let userCounter = 0;

const buildUserPayload = (overrides = {}) => {
    userCounter += 1;
    return {
        fullName: `Seller Tester ${userCounter}`,
        email: `seller${userCounter}@test.com`,
        password: "Password123",
        documentNumber: `90000000${userCounter}`,
        age: 28,
        phone: `30000000${userCounter}`,
        ...overrides,
    };
};

const registerUser = async (overrides = {}) => {
    const response = await request(app).post("/api/users/register").send(buildUserPayload(overrides));
    return response.body.data.user;
};

const createSeller = async ({ userId, businessName = "Mi negocio", description = "Tienda virtual", accountStatus }) => {
    return request(app)
        .post("/api/sellers")
        .send({ userId, businessName, description, accountStatus });
};

describe("Seller endpoints", () => {
    test("crea un comerciante para un usuario existente y actualiza su rol", async () => {
        const user = await registerUser();

        const response = await createSeller({ userId: user._id });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.user._id).toBe(user._id);
        expect(response.body.data.accountStatus).toBe("no_aprobado");

        const userResponse = await request(app).get(`/api/users/${user._id}`);
        expect(userResponse.body.data.role).toBe("seller");
    });

    test("evita crear dos perfiles de comerciante para el mismo usuario", async () => {
        const user = await registerUser();
        await createSeller({ userId: user._id });

        const duplicateResponse = await createSeller({ userId: user._id, businessName: "Otro negocio" });

        expect(duplicateResponse.status).toBe(409);
        expect(duplicateResponse.body.success).toBe(false);
    });

    test("lista los comerciantes con metadatos de paginación", async () => {
        const [userA, userB] = await Promise.all([registerUser(), registerUser()]);
        await createSeller({ userId: userA._id, businessName: "Tienda A" });
        await createSeller({ userId: userB._id, businessName: "Tienda B", accountStatus: "aprobado" });

        const response = await request(app).get("/api/sellers").query({ page: 1, limit: 10 });

        expect(response.status).toBe(200);
        expect(response.body.data.sellers.length).toBe(2);
        expect(response.body.data.pagination.total).toBe(2);
    });

    test("actualiza los datos de un comerciante", async () => {
        const user = await registerUser();
        const { body } = await createSeller({ userId: user._id });
        const sellerId = body.data._id;

        const updateResponse = await request(app)
            .put(`/api/sellers/${sellerId}`)
            .send({ accountStatus: "aprobado", description: "Tienda oficial" });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.data.accountStatus).toBe("aprobado");
        expect(updateResponse.body.data.description).toBe("Tienda oficial");
    });

    test("elimina un comerciante y revierte el rol del usuario a customer", async () => {
        const user = await registerUser();
        const { body } = await createSeller({ userId: user._id });
        const sellerId = body.data._id;

        const deleteResponse = await request(app).delete(`/api/sellers/${sellerId}`);

        expect(deleteResponse.status).toBe(200);

        const userResponse = await request(app).get(`/api/users/${user._id}`);
        expect(userResponse.body.data.role).toBe("customer");
    });

    test("valida campos requeridos al crear un comerciante", async () => {
        const response = await request(app).post("/api/sellers").send({ businessName: "Sin usuario" });

        expect(response.status).toBe(400);
        expect(response.body.missingFields).toContain("userId");
    });
});

