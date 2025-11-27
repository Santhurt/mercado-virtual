import request from "supertest";
import app from "../app.js";
import Order from "../src/models/Order.js";

const sampleOrder = {
    customerId: "user001",
    merchantId: "merchantA",
    status: "pending",
    products: [
        {
            productId: "prod345",
            title: "Camiseta clásica",
            unitPrice: 45000,
            quantity: 2,
            subtotal: 90000,
            image: "/uploads/products/345-red.png",
        },
    ],
    subtotal: 90000,
    shippingCost: 8000,
    taxes: 0,
    discount: 0,
    total: 98000,
    shippingAddress: {
        fullName: "Juan Pérez",
        phone: "3214567890",
        city: "Bogotá",
        addressLine: "Calle 12 #34-56",
        details: "Apartamento 402",
    },
    deliveryMethod: "delivery",
};

describe("Order Endpoints", () => {
    test("POST /api/orders - should create a new order", async () => {
        const response = await request(app).post("/api/orders").send(sampleOrder);

        expect(response.status).toBe(201);
        expect(response.body.customerId).toBe(sampleOrder.customerId);
        expect(response.body.total).toBe(sampleOrder.total);
        expect(response.body.status).toBe("pending");
        expect(response.body.history).toHaveLength(1);
        expect(response.body.history[0].status).toBe("pending");
    });

    test("GET /api/orders/:id - should get an order by ID", async () => {
        const order = new Order(sampleOrder);
        await order.save();

        const response = await request(app).get(`/api/orders/${order._id}`);

        expect(response.status).toBe(200);
        expect(response.body._id).toBe(order._id.toString());
        expect(response.body.customerId).toBe(sampleOrder.customerId);
    });

    test("GET /api/orders/:id - should return 404 for non-existent order", async () => {
        const fakeId = "60d5ecb8b487343568912345";
        const response = await request(app).get(`/api/orders/${fakeId}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Order not found");
    });

    test("GET /api/orders/user/:userId - should get orders for a user", async () => {
        await Order.create(sampleOrder);
        await Order.create({ ...sampleOrder, total: 50000 }); // Another order for same user

        const response = await request(app).get(`/api/orders/user/${sampleOrder.customerId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0].customerId).toBe(sampleOrder.customerId);
    });

    test("PATCH /api/orders/:id/status - should update order status", async () => {
        const order = new Order({
            ...sampleOrder,
            history: [{ status: "pending", actorId: "user001", timestamp: new Date() }]
        });
        await order.save();

        const updatePayload = {
            status: "shipped",
            actorId: "admin001",
        };

        const response = await request(app)
            .patch(`/api/orders/${order._id}/status`)
            .send(updatePayload);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("shipped");
        expect(response.body.history).toHaveLength(2);
        expect(response.body.history[1].status).toBe("shipped");
        expect(response.body.history[1].actorId).toBe("admin001");
    });

    test("PATCH /api/orders/:id/status - should return 404 for non-existent order", async () => {
        const fakeId = "60d5ecb8b487343568912345";
        const response = await request(app)
            .patch(`/api/orders/${fakeId}/status`)
            .send({ status: "shipped" });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Order not found");
    });
});
