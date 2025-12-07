
import request from "supertest";
import app from "../app.js";

let userCounter = 0;

const buildUserPayload = (overrides = {}) => {
    userCounter += 1;
    return {
        fullName: `Review Tester ${userCounter}`,
        email: `review${userCounter}@test.com`,
        password: "Password123",
        documentNumber: `80000000${userCounter}`,
        age: 30,
        phone: `31000000${userCounter}`,
        ...overrides,
    };
};

const createCustomer = async () => {
    const userResponse = await request(app).post("/api/users/register").send(buildUserPayload());
    const loginResponse = await request(app).post("/api/users/login").send({
        email: userResponse.body.data.user.email,
        password: "Password123",
    });
    return loginResponse.body.data.token;
};

const createSellerAndProduct = async () => {
    const userPayload = buildUserPayload();
    const userResponse = await request(app).post("/api/users/register").send(userPayload);
    const userId = userResponse.body.data.user._id;

    const sellerResponse = await request(app)
        .post("/api/sellers")
        .send({ userId, businessName: "Review Store", description: "Productos para reviews" });
    const sellerId = sellerResponse.body.data._id;

    const productResponse = await request(app).post("/api/products").send({
        title: "Producto Review",
        price: 100,
        status: "disponible",
        rating: 0,
        description: "Desc",
        stock: 10,
        specifications: { marca: "X" },
        sellerId,
    });

    return productResponse.body.data;
};

describe("Reseñas de Productos", () => {
    test("usuario autenticado puede crear una reseña", async () => {
        const product = await createSellerAndProduct();
        const token = await createCustomer();

        const response = await request(app)
            .post("/api/reviews")
            .set("Authorization", `Bearer ${token}`)
            .send({
                productId: product._id,
                rating: 5,
                comment: "Excelente producto",
            });

        expect(response.status).toBe(201);
        expect(response.body.data.rating).toBe(5);

        // Verificar actualización en producto
        const productResponse = await request(app).get(`/api/products/${product._id}`);
        expect(productResponse.body.data.rating).toBe(5);
        expect(productResponse.body.data.reviewCount).toBe(1);
    });

    test("usuario no puede reseñar el mismo producto dos veces", async () => {
        const product = await createSellerAndProduct();
        const token = await createCustomer();

        await request(app)
            .post("/api/reviews")
            .set("Authorization", `Bearer ${token}`)
            .send({ productId: product._id, rating: 4, comment: "Bien" });

        const response = await request(app)
            .post("/api/reviews")
            .set("Authorization", `Bearer ${token}`)
            .send({ productId: product._id, rating: 3, comment: "Mal" });

        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/Ya has realizado una reseña/);
    });

    test("el rating promedio se calcula correctamente", async () => {
        const product = await createSellerAndProduct();
        const token1 = await createCustomer();
        const token2 = await createCustomer();

        await request(app)
            .post("/api/reviews")
            .set("Authorization", `Bearer ${token1}`)
            .send({ productId: product._id, rating: 5 });

        await request(app)
            .post("/api/reviews")
            .set("Authorization", `Bearer ${token2}`)
            .send({ productId: product._id, rating: 3 });

        const productResponse = await request(app).get(`/api/products/${product._id}`);
        expect(productResponse.body.data.rating).toBe(4); // (5+3)/2 = 4
        expect(productResponse.body.data.reviewCount).toBe(2);
    });

    test("obtener reseñas de un producto", async () => {
        const product = await createSellerAndProduct();
        const token = await createCustomer();

        await request(app)
            .post("/api/reviews")
            .set("Authorization", `Bearer ${token}`)
            .send({ productId: product._id, rating: 5, comment: "Super" });

        const response = await request(app).get(`/api/reviews/${product._id}`);

        expect(response.status).toBe(200);
        expect(response.body.data.reviews).toHaveLength(1);
        expect(response.body.data.reviews[0].comment).toBe("Super");
    });
});
