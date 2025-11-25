import request from "supertest";
import app from "../app.js";

let userCounter = 0;

const buildUserPayload = (overrides = {}) => {
    userCounter += 1;
    return {
        fullName: `Chat Tester ${userCounter}`,
        email: `chat${userCounter}@test.com`,
        password: "Password123",
        documentNumber: `70000000${userCounter}`,
        age: 25,
        phone: `32000000${userCounter}`,
        ...overrides,
    };
};

const registerUser = async (overrides = {}) => {
    const response = await request(app).post("/api/users/register").send(buildUserPayload(overrides));
    return response.body.data.user;
};

const createChat = async (participants, lastMessage = null) => {
    const payload = { participants };
    if (lastMessage !== null) {
        payload.lastMessage = lastMessage;
    }
    return request(app).post("/api/chats").send(payload);
};

describe("Chat endpoints", () => {
    test("crea un chat con dos participantes", async () => {
        const [user1, user2] = await Promise.all([registerUser(), registerUser()]);

        const response = await createChat([user1._id, user2._id]);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.participants).toHaveLength(2);
        expect(response.body.data.participants.map((p) => p._id)).toContain(user1._id);
        expect(response.body.data.participants.map((p) => p._id)).toContain(user2._id);
        expect(response.body.data.createdAt).toBeDefined();
        expect(response.body.data.updatedAt).toBeDefined();
    });

    test("crea un chat con último mensaje", async () => {
        const [user1, user2] = await Promise.all([registerUser(), registerUser()]);
        const lastMessage = {
            text: "Hola, ¿cómo estás?",
            sender: user1._id,
            timestamp: new Date().toISOString(),
        };

        const response = await createChat([user1._id, user2._id], lastMessage);

        expect(response.status).toBe(201);
        expect(response.body.data.lastMessage).toEqual(lastMessage);
    });

    test("rechaza crear un chat sin participantes", async () => {
        const response = await request(app).post("/api/chats").send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/participants/i);
    });

    test("rechaza crear un chat con menos de 2 participantes", async () => {
        const user1 = await registerUser();

        const response = await createChat([user1._id]);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/al menos 2 participantes/i);
    });

    test("rechaza crear un chat con participantes que no existen", async () => {
        const fakeId = "507f1f77bcf86cd799439011";

        const response = await createChat([fakeId, "507f1f77bcf86cd799439012"]);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/participantes no existen/i);
    });

    test("evita crear chats duplicados con los mismos participantes", async () => {
        const [user1, user2] = await Promise.all([registerUser(), registerUser()]);

        const firstResponse = await createChat([user1._id, user2._id]);
        expect(firstResponse.status).toBe(201);

        const secondResponse = await createChat([user1._id, user2._id]);
        expect(secondResponse.status).toBe(200);
        expect(secondResponse.body.message).toMatch(/ya existe/i);
        expect(secondResponse.body.data._id).toBe(firstResponse.body.data._id);
    });

    test("elimina duplicados de participantes al crear un chat", async () => {
        const [user1, user2] = await Promise.all([registerUser(), registerUser()]);

        const response = await createChat([user1._id, user2._id, user1._id]);

        expect(response.status).toBe(201);
        expect(response.body.data.participants).toHaveLength(2);
    });

    test("obtiene todos los chats con paginación", async () => {
        const [user1, user2, user3] = await Promise.all([
            registerUser(),
            registerUser(),
            registerUser(),
        ]);

        await createChat([user1._id, user2._id]);
        await createChat([user1._id, user3._id]);
        await createChat([user2._id, user3._id]);

        const response = await request(app).get("/api/chats").query({ page: 1, limit: 10 });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.chats.length).toBeGreaterThanOrEqual(3);
        expect(response.body.data.pagination).toEqual({
            page: 1,
            limit: 10,
            total: expect.any(Number),
            pages: expect.any(Number),
        });
    });

    test("filtra chats por usuario", async () => {
        const [user1, user2, user3] = await Promise.all([
            registerUser(),
            registerUser(),
            registerUser(),
        ]);

        await createChat([user1._id, user2._id]);
        await createChat([user1._id, user3._id]);
        await createChat([user2._id, user3._id]);

        const response = await request(app).get("/api/chats").query({ userId: user1._id });

        expect(response.status).toBe(200);
        expect(response.body.data.chats.length).toBe(2);
        response.body.data.chats.forEach((chat) => {
            const participantIds = chat.participants.map((p) => p._id);
            expect(participantIds).toContain(user1._id);
        });
    });

    test("obtiene un chat por ID", async () => {
        const [user1, user2] = await Promise.all([registerUser(), registerUser()]);
        const { body } = await createChat([user1._id, user2._id]);
        const chatId = body.data._id;

        const response = await request(app).get(`/api/chats/${chatId}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data._id).toBe(chatId);
        expect(response.body.data.participants).toHaveLength(2);
    });

    test("retorna 404 al buscar un chat inexistente", async () => {
        const fakeId = "507f1f77bcf86cd799439011";

        const response = await request(app).get(`/api/chats/${fakeId}`);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/no encontrado/i);
    });

    test("obtiene chats de un usuario específico", async () => {
        const [user1, user2, user3] = await Promise.all([
            registerUser(),
            registerUser(),
            registerUser(),
        ]);

        await createChat([user1._id, user2._id]);
        await createChat([user1._id, user3._id]);
        await createChat([user2._id, user3._id]);

        const response = await request(app)
            .get(`/api/chats/user/${user1._id}`)
            .query({ page: 1, limit: 10 });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.chats.length).toBe(2);
        expect(response.body.data.pagination.total).toBe(2);
        response.body.data.chats.forEach((chat) => {
            const participantIds = chat.participants.map((p) => p._id);
            expect(participantIds).toContain(user1._id);
        });
    });

    test("retorna 404 al buscar chats de un usuario inexistente", async () => {
        const fakeUserId = "507f1f77bcf86cd799439011";

        const response = await request(app).get(`/api/chats/user/${fakeUserId}`);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/Usuario no encontrado/i);
    });

    test("actualiza un chat", async () => {
        const [user1, user2, user3] = await Promise.all([
            registerUser(),
            registerUser(),
            registerUser(),
        ]);
        const { body } = await createChat([user1._id, user2._id]);
        const chatId = body.data._id;

        const newLastMessage = {
            text: "Mensaje actualizado",
            sender: user2._id,
            timestamp: new Date().toISOString(),
        };

        const response = await request(app)
            .put(`/api/chats/${chatId}`)
            .send({ lastMessage: newLastMessage });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.lastMessage).toEqual(newLastMessage);
    });

    test("actualiza participantes de un chat", async () => {
        const [user1, user2, user3] = await Promise.all([
            registerUser(),
            registerUser(),
            registerUser(),
        ]);
        const { body } = await createChat([user1._id, user2._id]);
        const chatId = body.data._id;

        const response = await request(app)
            .put(`/api/chats/${chatId}`)
            .send({ participants: [user1._id, user3._id] });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        const participantIds = response.body.data.participants.map((p) => p._id);
        expect(participantIds).toContain(user1._id);
        expect(participantIds).toContain(user3._id);
        expect(participantIds).not.toContain(user2._id);
    });

    test("rechaza actualizar chat con menos de 2 participantes", async () => {
        const [user1, user2] = await Promise.all([registerUser(), registerUser()]);
        const { body } = await createChat([user1._id, user2._id]);
        const chatId = body.data._id;

        const response = await request(app).put(`/api/chats/${chatId}`).send({ participants: [user1._id] });

        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/al menos 2 participantes/i);
    });

    test("actualiza solo el último mensaje", async () => {
        const [user1, user2] = await Promise.all([registerUser(), registerUser()]);
        const { body } = await createChat([user1._id, user2._id]);
        const chatId = body.data._id;

        const lastMessage = {
            text: "Nuevo mensaje",
            sender: user1._id,
            timestamp: new Date().toISOString(),
        };

        const response = await request(app)
            .patch(`/api/chats/${chatId}/last-message`)
            .send({ lastMessage });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.lastMessage).toEqual(lastMessage);
        expect(response.body.message).toMatch(/último mensaje/i);
    });

    test("rechaza actualizar último mensaje sin el campo", async () => {
        const [user1, user2] = await Promise.all([registerUser(), registerUser()]);
        const { body } = await createChat([user1._id, user2._id]);
        const chatId = body.data._id;

        const response = await request(app).patch(`/api/chats/${chatId}/last-message`).send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/lastMessage.*requerido/i);
    });

    test("elimina un chat", async () => {
        const [user1, user2] = await Promise.all([registerUser(), registerUser()]);
        const { body } = await createChat([user1._id, user2._id]);
        const chatId = body.data._id;

        const response = await request(app).delete(`/api/chats/${chatId}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toMatch(/eliminado/i);

        const getResponse = await request(app).get(`/api/chats/${chatId}`);
        expect(getResponse.status).toBe(404);
    });

    test("retorna 404 al eliminar un chat inexistente", async () => {
        const fakeId = "507f1f77bcf86cd799439011";

        const response = await request(app).delete(`/api/chats/${fakeId}`);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    test("popula correctamente los participantes sin contraseña", async () => {
        const [user1, user2] = await Promise.all([registerUser(), registerUser()]);
        const { body } = await createChat([user1._id, user2._id]);

        expect(body.data.participants).toHaveLength(2);
        body.data.participants.forEach((participant) => {
            expect(participant.password).toBeUndefined();
            expect(participant.fullName).toBeDefined();
            expect(participant.email).toBeDefined();
        });
    });

    test("ordena los chats por fecha de actualización descendente", async () => {
        const [user1, user2, user3] = await Promise.all([
            registerUser(),
            registerUser(),
            registerUser(),
        ]);

        const chat1 = await createChat([user1._id, user2._id]);
        await new Promise((resolve) => setTimeout(resolve, 10)); // Pequeña pausa
        const chat2 = await createChat([user1._id, user3._id]);
        await new Promise((resolve) => setTimeout(resolve, 10));
        const chat3 = await createChat([user2._id, user3._id]);

        const response = await request(app).get("/api/chats");

        expect(response.status).toBe(200);
        const chats = response.body.data.chats;
        expect(chats.length).toBeGreaterThanOrEqual(3);

        // El chat más reciente debe estar primero
        const chat3Id = chat3.body.data._id;
        expect(chats[0]._id).toBe(chat3Id);
    });
});

