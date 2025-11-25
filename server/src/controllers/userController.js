import jwt from "jsonwebtoken";
import User from "../models/User.js";

const sanitizeUser = (userDoc) => {
    if (!userDoc) return null;
    const user = userDoc.toObject();
    delete user.password;
    return user;
};

const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET no está definido en las variables de entorno");
    }

    return jwt.sign({ id: userId }, secret, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });
};

export const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, documentNumber, age, phone, role, registrationDate } = req.body;

        const missingFields = ["fullName", "email", "password", "documentNumber", "age", "phone"].filter(
            (field) => !req.body[field],
        );

        if (missingFields.length) {
            return res.status(400).json({
                success: false,
                message: "Campos requeridos faltantes",
                missingFields,
            });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { documentNumber }],
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "El correo o número de cédula ya están registrados",
            });
        }

        const user = await User.create({
            fullName,
            email,
            password,
            documentNumber,
            age,
            phone,
            role,
            registrationDate,
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: "Usuario creado correctamente",
            data: {
                user: sanitizeUser(user),
                token,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al registrar el usuario",
            error: error.message,
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Debe proporcionar email y contraseña",
            });
        }

        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: "Credenciales inválidas",
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Inicio de sesión exitoso",
            data: {
                user: sanitizeUser(user),
                token,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al iniciar sesión",
            error: error.message,
        });
    }
};

export const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const [users, total] = await Promise.all([
            User.find().skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
            User.countDocuments(),
        ]);

        res.status(200).json({
            success: true,
            data: {
                users: users.map(sanitizeUser),
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit)),
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los usuarios",
            error: error.message,
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }

        res.status(200).json({
            success: true,
            data: sanitizeUser(user),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el usuario",
            error: error.message,
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }

        const updatableFields = ["fullName", "email", "documentNumber", "age", "phone", "role", "registrationDate"];
        updatableFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        if (req.body.password) {
            user.password = req.body.password;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Usuario actualizado correctamente",
            data: sanitizeUser(user),
        });
    } catch (error) {
        const status = error.code === 11000 ? 409 : 500;
        res.status(status).json({
            success: false,
            message: status === 409 ? "El correo o número de cédula ya están registrados" : "Error al actualizar el usuario",
            error: error.message,
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }

        res.status(200).json({
            success: true,
            message: "Usuario eliminado correctamente",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el usuario",
            error: error.message,
        });
    }
};

