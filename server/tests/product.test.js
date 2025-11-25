import request from "supertest";
import app from "../app.js";

let userCounter = 0;

const buildUserPayload = (overrides = {}) => {
    userCounter += 1;
    return {
        fullName: `Product Tester ${userCounter}`,
        email: `product${userCounter}@test.com`,
        password: "Password123",
        documentNumber: `80000000${userCounter}`,
        age: 30,
        phone: `31000000${userCounter}`,
        ...overrides,
    };
};

const createSellerProfile = async () => {
    const userResponse = await request(app).post("/api/users/register").send(buildUserPayload());
    const userId = userResponse.body.data.user._id;

    const sellerResponse = await request(app)
        .post("/api/sellers")
        .send({ userId, businessName: "Tech Store", description: "Productos de prueba" });

    return sellerResponse.body.data;
};

const buildProductPayload = (overrides = {}) => ({
    title: "Producto destacado",
    price: 150000,
    status: "disponible",
    rating: 4.5,
    description: "Descripción de producto",
    stock: 20,
    specifications: { marca: "ACME" },
    ...overrides,
});

describe("Relación producto - comerciante", () => {
    test("crea un producto asociado a un comerciante y lo agrega a su lista", async () => {
        const seller = await createSellerProfile();

        const response = await request(app).post("/api/products").send(buildProductPayload({ sellerId: seller._id }));

        expect(response.status).toBe(201);
        expect(response.body.data.seller._id).toBe(seller._id);

        const sellerResponse = await request(app).get(`/api/sellers/${seller._id}`);
        expect(sellerResponse.body.data.products).toHaveLength(1);
        expect(sellerResponse.body.data.products[0]._id).toBe(response.body.data._id);
    });

    test("rechaza crear un producto sin especificar sellerId", async () => {
        const response = await request(app).post("/api/products").send(buildProductPayload());

        expect(response.status).toBe(400);
        expect(response.body.missingFields).toContain("sellerId");
    });

    test("elimina un producto y lo remueve del comerciante", async () => {
        const seller = await createSellerProfile();
        const { body } = await request(app)
            .post("/api/products")
            .send(buildProductPayload({ sellerId: seller._id }));
        const productId = body.data._id;

        const deleteResponse = await request(app).delete(`/api/products/${productId}`);
        expect(deleteResponse.status).toBe(200);

        const sellerResponse = await request(app).get(`/api/sellers/${seller._id}`);
        expect(sellerResponse.body.data.products).toHaveLength(0);
    });

    test("eliminar un comerciante elimina sus productos asociados", async () => {
        const seller = await createSellerProfile();
        const { body } = await request(app)
            .post("/api/products")
            .send(buildProductPayload({ sellerId: seller._id }));
        const productId = body.data._id;

        await request(app).delete(`/api/sellers/${seller._id}`).expect(200);

        const productResponse = await request(app).get(`/api/products/${productId}`);
        expect(productResponse.status).toBe(404);
    });
});

