import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        lastMessage: {
            type: Schema.Types.Mixed,
            default: null,
        },
    },
    { timestamps: true },
);

// Índice para búsquedas eficientes por participantes
chatSchema.index({ participants: 1 });

// Validación: debe tener al menos 2 participantes
chatSchema.pre("save", function validateParticipants() {
    if (this.participants.length < 2) {
        throw new Error("Un chat debe tener al menos 2 participantes");
    }
    // Eliminar duplicados
    this.participants = [...new Set(this.participants.map((p) => p.toString()))].map(
        (id) => new mongoose.Types.ObjectId(id),
    );
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;

