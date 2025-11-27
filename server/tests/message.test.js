import request from "supertest";
import app from "../app.js";
import Chat from "../src/models/Chat.js";
import Message from "../src/models/Message.js";

let userCounter = 0;

const buildUserPayload = (overrides = {}) => {
    userCounter += 1;
    return {
        fullName: `Message Tester ${userCounter}`,
        email: `msg${userCounter}@test.com`,
        password: "Password123",
        documentNumber: `80000000${userCounter}`,
        age: 25,
        phone: `33000000${userCounter}`,
        ...overrides,
    };
};

const registerUser = async (overrides = {}) => {
    const response = await request(app).post("/api/users/register").send(buildUserPayload(overrides));
    return {
        ...response.body.data.user,
        token: response.body.data.token,
    };
};

const createChat = async (participants) => {
    const chat = new Chat({ participants });
    return await chat.save();
};

describe("Message endpoints", () => {
    test("crea un mensaje en un chat existente", async () => {
        const [user1, user2] = await Promise.all([registerUser(), registerUser()]);
        const chat = await createChat([user1._id, user2._id]);

        const messagePayload = {
            chatId: chat._id,
            receiverId: user2._id,
            content: "Hola mundo",
        };

        const response = await request(app)
            .post("/api/messages")
            .set("Authorization", `Bearer ${user1.token}`)
            .send(messagePayload);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.content).toBe(messagePayload.content);
        expect(response.body.data.senderId).toBe(user1._id);
        expect(response.body.data.receiverId).toBe(user2._id);

        // Verificar que se actualizó el último mensaje del chat
        const updatedChat = await Chat.findById(chat._id);
        expect(updatedChat.lastMessage.text).toBe(messagePayload.content);
        expect(updatedChat.lastMessage.sender.toString()).toBe(user1._id);
    });

    test("rechaza crear mensaje si no es participante", async () => {
        const [user1, user2, user3] = await Promise.all([
            registerUser(),
            registerUser(),
            registerUser(),
        ]);
        const chat = await createChat([user1._id, user2._id]);

        const messagePayload = {
            chatId: chat._id,
            receiverId: user2._id,
            content: "Intruso",
        };

        const response = await request(app)
            .post("/api/messages")
            .set("Authorization", `Bearer ${user3.token}`)
            .send(messagePayload);

        expect(response.status).toBe(403);
        expect(response.body.message).toMatch(/no pertenecen a este chat/i);
    });

    test("obtiene mensajes de un chat", async () => {
        const [user1, user2] = await Promise.all([registerUser(), registerUser()]);
        const chat = await createChat([user1._id, user2._id]);

        // Crear algunos mensajes directamente en la BD
        await Message.create({ chatId: chat._id, senderId: user1._id, receiverId: user2._id, content: "Msg 1" });
        await new Promise((resolve) => setTimeout(resolve, 100)); // Ensure timestamp difference
        await Message.create({ chatId: chat._id, senderId: user2._id, receiverId: user1._id, content: "Msg 2" });

        const response = await request(app)
            .get(`/api/messages/${chat._id}`)
            .set("Authorization", `Bearer ${user1.token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.messages).toHaveLength(2);
        expect(response.body.data.messages[0].content).toBe("Msg 2"); // Orden descendente por defecto
    });

    test("rechaza obtener mensajes si no es participante", async () => {
        const [user1, user2, user3] = await Promise.all([
            registerUser(),
            registerUser(),
            registerUser(),
        ]);
        const chat = await createChat([user1._id, user2._id]);

        const response = await request(app)
            .get(`/api/messages/${chat._id}`)
            .set("Authorization", `Bearer ${user3.token}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toMatch(/No tienes permiso/i);
    });
});
