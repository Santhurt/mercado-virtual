import request from "supertest";
import app from "../app.js";
import Cart from "../src/models/Cart.js";

const sampleCartItem = {
    userId: "user123",
    productId: "prod001",
    title: "Producto de prueba",
    price: 50000,
    quantity: 2,
    image: "/uploads/products/001.png",
};

describe("Cart Endpoints", () => {
    test("GET /api/cart - should create and return empty cart for new user", async () => {
        const response = await request(app)
            .get("/api/cart")
            .query({ userId: "newUser123" });

        expect(response.status).toBe(200);
        expect(response.body.userId).toBe("newUser123");
        expect(response.body.items).toHaveLength(0);
        expect(response.body.totalPrice).toBe(0);
        expect(response.body.status).toBe("active");
    });

    test("GET /api/cart - should return existing cart", async () => {
        const cart = new Cart({
            userId: "user123",
            items: [
                {
                    productId: "prod001",
                    title: "Producto existente",
                    price: 30000,
                    quantity: 1,
                },
            ],
        });
        await cart.save();

        const response = await request(app)
            .get("/api/cart")
            .query({ userId: "user123" });

        expect(response.status).toBe(200);
        expect(response.body.userId).toBe("user123");
        expect(response.body.items).toHaveLength(1);
        expect(response.body.totalPrice).toBe(30000);
    });

    test("GET /api/cart - should return 400 if no userId or sessionId", async () => {
        const response = await request(app).get("/api/cart");

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("UserId or SessionId is required");
    });

    test("POST /api/cart/add - should add new item to cart", async () => {
        const response = await request(app)
            .post("/api/cart/add")
            .send(sampleCartItem);

        expect(response.status).toBe(200);
        expect(response.body.items).toHaveLength(1);
        expect(response.body.items[0].productId).toBe(sampleCartItem.productId);
        expect(response.body.items[0].quantity).toBe(2);
        expect(response.body.totalPrice).toBe(100000); // 50000 * 2
    });

    test("POST /api/cart/add - should update quantity if item already exists", async () => {
        const cart = new Cart({
            userId: "user456",
            items: [
                {
                    productId: "prod002",
                    title: "Producto existente",
                    price: 25000,
                    quantity: 1,
                },
            ],
        });
        await cart.save();

        const response = await request(app)
            .post("/api/cart/add")
            .send({
                userId: "user456",
                productId: "prod002",
                title: "Producto existente",
                price: 25000,
                quantity: 2,
            });

        expect(response.status).toBe(200);
        expect(response.body.items).toHaveLength(1);
        expect(response.body.items[0].quantity).toBe(3); // 1 + 2
        expect(response.body.totalPrice).toBe(75000); // 25000 * 3
    });

    test("POST /api/cart/add - should return 400 if no userId or sessionId", async () => {
        const response = await request(app)
            .post("/api/cart/add")
            .send({
                productId: "prod001",
                title: "Producto",
                price: 10000,
                quantity: 1,
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("UserId or SessionId is required");
    });

    test("PUT /api/cart/update - should update item quantity", async () => {
        const cart = new Cart({
            userId: "user789",
            items: [
                {
                    productId: "prod003",
                    title: "Producto a actualizar",
                    price: 40000,
                    quantity: 2,
                },
            ],
        });
        await cart.save();

        const response = await request(app)
            .put("/api/cart/update")
            .send({
                userId: "user789",
                productId: "prod003",
                quantity: 5,
            });

        expect(response.status).toBe(200);
        expect(response.body.items[0].quantity).toBe(5);
        expect(response.body.totalPrice).toBe(200000); // 40000 * 5
    });

    test("PUT /api/cart/update - should remove item if quantity is 0", async () => {
        const cart = new Cart({
            userId: "user999",
            items: [
                {
                    productId: "prod004",
                    title: "Producto a eliminar",
                    price: 15000,
                    quantity: 1,
                },
            ],
        });
        await cart.save();

        const response = await request(app)
            .put("/api/cart/update")
            .send({
                userId: "user999",
                productId: "prod004",
                quantity: 0,
            });

        expect(response.status).toBe(200);
        expect(response.body.items).toHaveLength(0);
        expect(response.body.totalPrice).toBe(0);
    });

    test("PUT /api/cart/update - should return 404 if cart not found", async () => {
        const response = await request(app)
            .put("/api/cart/update")
            .send({
                userId: "nonExistentUser",
                productId: "prod001",
                quantity: 1,
            });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Cart not found");
    });

    test("PUT /api/cart/update - should return 404 if item not in cart", async () => {
        const cart = new Cart({
            userId: "user888",
            items: [],
        });
        await cart.save();

        const response = await request(app)
            .put("/api/cart/update")
            .send({
                userId: "user888",
                productId: "prod999",
                quantity: 1,
            });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Item not found in cart");
    });

    test("DELETE /api/cart/remove - should remove item from cart", async () => {
        const cart = new Cart({
            userId: "user555",
            items: [
                {
                    productId: "prod005",
                    title: "Producto 1",
                    price: 20000,
                    quantity: 1,
                },
                {
                    productId: "prod006",
                    title: "Producto 2",
                    price: 30000,
                    quantity: 1,
                },
            ],
        });
        await cart.save();

        const response = await request(app)
            .delete("/api/cart/remove")
            .send({
                userId: "user555",
                productId: "prod005",
            });

        expect(response.status).toBe(200);
        expect(response.body.items).toHaveLength(1);
        expect(response.body.items[0].productId).toBe("prod006");
        expect(response.body.totalPrice).toBe(30000);
    });

    test("DELETE /api/cart/remove - should return 404 if cart not found", async () => {
        const response = await request(app)
            .delete("/api/cart/remove")
            .send({
                userId: "nonExistentUser",
                productId: "prod001",
            });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Cart not found");
    });

    test("DELETE /api/cart/clear - should clear all items from cart", async () => {
        const cart = new Cart({
            userId: "user666",
            items: [
                {
                    productId: "prod007",
                    title: "Producto 1",
                    price: 10000,
                    quantity: 2,
                },
                {
                    productId: "prod008",
                    title: "Producto 2",
                    price: 20000,
                    quantity: 1,
                },
            ],
        });
        await cart.save();

        const response = await request(app)
            .delete("/api/cart/clear")
            .send({
                userId: "user666",
            });

        expect(response.status).toBe(200);
        expect(response.body.items).toHaveLength(0);
        expect(response.body.totalPrice).toBe(0);
    });

    test("DELETE /api/cart/clear - should return 404 if cart not found", async () => {
        const response = await request(app)
            .delete("/api/cart/clear")
            .send({
                userId: "nonExistentUser",
            });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Cart not found");
    });

    test("POST /api/cart/add - should work with sessionId instead of userId", async () => {
        const response = await request(app)
            .post("/api/cart/add")
            .send({
                sessionId: "session123",
                productId: "prod009",
                title: "Producto con sesión",
                price: 35000,
                quantity: 1,
            });

        expect(response.status).toBe(200);
        expect(response.body.sessionId).toBe("session123");
        expect(response.body.items).toHaveLength(1);
        expect(response.body.totalPrice).toBe(35000);
    });
});
