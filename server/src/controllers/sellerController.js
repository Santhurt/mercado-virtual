import Seller, { SELLER_ACCOUNT_STATUSES } from "../models/Seller.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

const SELLER_POPULATE_CONFIG = [
    { path: "user", select: "-password" },
    {
        path: "products",
        select: "title price status stock images createdAt updatedAt",
    },
];

const populateSeller = (query) => query.populate(SELLER_POPULATE_CONFIG);
const populateSellerDoc = (doc) => doc.populate(SELLER_POPULATE_CONFIG);

const validateAccountStatus = (status) => !status || SELLER_ACCOUNT_STATUSES.includes(status);

export const createSeller = async (req, res) => {
    try {
        const { userId, businessName, description, accountStatus } = req.body;

        const missingFields = ["userId", "businessName"].filter((field) => !req.body[field]);
        if (missingFields.length) {
            return res.status(400).json({
                success: false,
                message: "Campos requeridos faltantes",
                missingFields,
            });
        }

        if (!validateAccountStatus(accountStatus)) {
            return res.status(400).json({
                success: false,
                message: "Estado de cuenta inválido",
                allowedStatuses: SELLER_ACCOUNT_STATUSES,
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }

        const existingSeller = await Seller.findOne({ user: userId });
        if (existingSeller) {
            return res.status(409).json({
                success: false,
                message: "El usuario ya tiene un perfil de comerciante",
            });
        }

        const seller = await Seller.create({
            user: userId,
            businessName,
            description,
            accountStatus,
        });

        if (user.role !== "seller") {
            user.role = "seller";
            await user.save();
        }

        const populatedSeller = await populateSellerDoc(seller);

        res.status(201).json({
            success: true,
            message: "Comerciante creado correctamente",
            data: populatedSeller,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear el comerciante",
            error: error.message,
        });
    }
};

export const getSellers = async (req, res) => {
    try {
        const { page = 1, limit = 10, accountStatus } = req.query;
        const filters = {};

        if (accountStatus) {
            if (!validateAccountStatus(accountStatus)) {
                return res.status(400).json({
                    success: false,
                    message: "Estado de cuenta inválido",
                    allowedStatuses: SELLER_ACCOUNT_STATUSES,
                });
            }
            filters.accountStatus = accountStatus;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [sellers, total] = await Promise.all([
            populateSeller(
                Seller.find(filters)
                    .skip(skip)
                    .limit(Number(limit))
                    .sort({ createdAt: -1 }),
            ),
            Seller.countDocuments(filters),
        ]);

        res.status(200).json({
            success: true,
            data: {
                sellers,
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
            message: "Error al obtener los comerciantes",
            error: error.message,
        });
    }
};

export const getSellerById = async (req, res) => {
    try {
        const seller = await populateSeller(Seller.findById(req.params.id));

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Comerciante no encontrado",
            });
        }

        res.status(200).json({
            success: true,
            data: seller,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el comerciante",
            error: error.message,
        });
    }
};

export const updateSeller = async (req, res) => {
    try {
        const updatableFields = ["businessName", "description", "accountStatus"];

        if (req.body.accountStatus && !validateAccountStatus(req.body.accountStatus)) {
            return res.status(400).json({
                success: false,
                message: "Estado de cuenta inválido",
                allowedStatuses: SELLER_ACCOUNT_STATUSES,
            });
        }

        const seller = await Seller.findById(req.params.id);
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Comerciante no encontrado",
            });
        }

        updatableFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                seller[field] = req.body[field];
            }
        });

        await seller.save();

        const populatedSeller = await populateSellerDoc(seller);

        res.status(200).json({
            success: true,
            message: "Comerciante actualizado correctamente",
            data: populatedSeller,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el comerciante",
            error: error.message,
        });
    }
};

export const deleteSeller = async (req, res) => {
    try {
        const seller = await Seller.findByIdAndDelete(req.params.id);

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Comerciante no encontrado",
            });
        }

        await Product.deleteMany({ seller: seller._id });

        const user = await User.findById(seller.user);
        if (user && user.role === "seller") {
            user.role = "customer";
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: "Comerciante eliminado correctamente",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el comerciante",
            error: error.message,
        });
    }
};

