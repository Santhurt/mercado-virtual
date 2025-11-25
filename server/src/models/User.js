import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        documentNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        age: {
            type: Number,
            required: true,
            min: 0,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        registrationDate: {
            type: Date,
            default: Date.now,
        },
        role: {
            type: String,
            enum: ["admin", "seller", "customer"],
            default: "customer",
        },
        profileImage: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret) => {
                delete ret.password;
                return ret;
            },
        },
        toObject: {
            transform: (_doc, ret) => {
                delete ret.password;
                return ret;
            },
        },
    },
);

userSchema.pre("save", async function hashPassword() {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;

