import mongoose from "mongoose";
import Product from "../models/Product.js";
import Seller from "../models/Seller.js";
import { unlink } from "fs/promises";
import { join, relative } from "path";
import Category from "../models/Category.js";

const MAX_PRODUCT_IMAGES = 5;

const populateProduct = (queryOrDoc) =>
    queryOrDoc.populate([
        // Primera configuración: Popular Seller y su User
        {
            path: "seller",
            select: "businessName accountStatus user",
            populate: { path: "user", select: "-password" },
        },
        // Segunda configuración: Popular Categories
        {
            path: "categories",
            select: "name slug",
        },
    ]);

const removeUploadedFiles = async (files = []) => {
    await Promise.all(
        files.map(async (file) => {
            if (!file?.path) return;
            try {
                await unlink(file.path);
            } catch (error) {
                // ignorar errores si el archivo no existe
            }
        }),
    );
};

const deleteStoredImages = async (imagePaths = []) => {
    await Promise.all(
        imagePaths.map(async (imagePath) => {
            if (!imagePath) return;
            const absolutePath = join(process.cwd(), imagePath);
            try {
                await unlink(absolutePath);
            } catch (error) {
                // ignorar errores si el archivo no existe
            }
        }),
    );
};

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            minPrice,
            maxPrice,
            sellerId,
            categoryId,
        } = req.query;

        // Construir filtros
        const filters = {};
        if (status) filters.status = status;
        if (sellerId) filters.seller = sellerId;

        if (categoryId) {
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "El formato del ID de categoría proporcionado no es válido.",
                });
            }

            filters.categories = categoryId;
        }

        if (minPrice || maxPrice) {
            filters.price = {};
            if (minPrice) filters.price.$gte = Number(minPrice);
            if (maxPrice) filters.price.$lte = Number(maxPrice);
        }

        // Calcular paginación
        const skip = (Number(page) - 1) * Number(limit);

        // Obtener productos con filtros y paginación
        const products = await populateProduct(
            Product.find(filters)
                .limit(Number(limit))
                .skip(skip)
                .sort({ createdAt: -1 }),
        );

        // Contar total de productos
        const total = await Product.countDocuments(filters);

        res.status(200).json({
            success: true,
            data: {
                products,
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
            message: "Error al obtener los productos",
            error: error.message,
        });
    }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await populateProduct(Product.findById(id));

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado",
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el producto",
            error: error.message,
        });
    }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
    try {
        const { sellerId, categories, ...productData } = req.body;

        // Validar campos requeridos
        const requiredFields = [
            "title",
            "price",
            "status",
            "description",
            "stock",
            "sellerId",
            "categories",
        ];
        const missingFields = requiredFields.filter(
            (field) => !req.body[field],
        );

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Campos requeridos faltantes",
                missingFields,
            });
        }

        if (!Array.isArray(categories) || categories.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "El campo 'categories' debe ser un array de IDs de categoría y no puede estar vacío",
            });
        }

        const validCategoryIds = categories.filter((id) =>
            mongoose.Types.ObjectId.isValid(id),
        );

        const existingCategories = await Category.find({
            _id: { $in: categories },
        });

        if (existingCategories.length !== categories.length) {
            // Esto significa que uno o más IDs de categoría no existen
            return res.status(400).json({
                success: false,
                message: "Una o más categorías proporcionadas no existen.",
            });
        }

        if (validCategoryIds.length !== categories.length) {
            return res.status(400).json({
                success: false,
                message: "El array 'categories' contiene IDs no válidos.",
            });
        }

        // Validar que features y tags sean arrays si se proporcionan
        if (productData.features && !Array.isArray(productData.features)) {
            return res.status(400).json({
                success: false,
                message: "El campo 'features' debe ser un array",
            });
        }

        if (productData.tags && !Array.isArray(productData.tags)) {
            return res.status(400).json({
                success: false,
                message: "El campo 'tags' debe ser un array",
            });
        }

        // Validar que specifications sea un objeto si se proporciona
        if (
            productData.specifications &&
            typeof productData.specifications !== "object"
        ) {
            return res.status(400).json({
                success: false,
                message: "El campo 'specifications' debe ser un objeto",
            });
        }

        if (productData.rating !== undefined) {
            if (productData.rating < 0 || productData.rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: "El rating debe estar entre 0 y 5",
                });
            }
        }

        // Validar stock
        if (productData.stock < 0) {
            return res.status(400).json({
                success: false,
                message: "El stock no puede ser negativo",
            });
        }

        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Comerciante no encontrado",
            });
        }

        const product = await Product.create({
            ...productData,
            seller: sellerId,
        });

        seller.products.push(product._id);
        await seller.save();

        await populateProduct(product);

        res.status(201).json({
            success: true,
            message: "Producto creado exitosamente",
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear el producto",
            error: error.message,
        });
    }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (updateData.categories !== undefined) {
            const categories = updateData.categories;

            // 1. Validar que 'categories' sea un arreglo
            if (!Array.isArray(categories)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "El campo 'categories' debe ser un array de IDs de categoría.",
                });
            }

            // Si el arreglo está vacío, Mongoose lo manejará según la validación del esquema (required: true)

            // 2. Validar que todos los IDs sean válidos y existan (solo si hay IDs)
            if (categories.length > 0) {
                const validCategoryIds = categories.filter((id) =>
                    mongoose.Types.ObjectId.isValid(id),
                );
                if (validCategoryIds.length !== categories.length) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "El array 'categories' contiene IDs no válidos.",
                    });
                }

                const existingCategories = await Category.find({
                    _id: { $in: categories },
                });

                if (existingCategories.length !== categories.length) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Una o más categorías proporcionadas no existen.",
                    });
                }

                // Si todo es válido, la actualización se hace con el array de IDs
                updateData.categories = existingCategories.map(
                    (cat) => cat._id,
                );
            } else {
                // Si el array está vacío, forzamos la validación del esquema.
                // Si el esquema de Producto tiene 'required: true' en categories, esto fallará.
                // Si quieres permitir 0 categorías, deberías cambiar el esquema.
                // Como tiene 'required: true', devolvemos error antes de la BD.
                return res.status(400).json({
                    success: false,
                    message: "Un producto debe tener al menos una categoría.",
                });
            }
        }

        // Validar rating si se proporciona
        if (
            updateData.rating !== undefined &&
            (updateData.rating < 0 || updateData.rating > 5)
        ) {
            return res.status(400).json({
                success: false,
                message: "El rating debe estar entre 0 y 5",
            });
        }

        // Validar stock si se proporciona
        if (updateData.stock !== undefined && updateData.stock < 0) {
            return res.status(400).json({
                success: false,
                message: "El stock no puede ser negativo",
            });
        }

        // Validar que features y tags sean arrays si se proporcionan
        if (
            updateData.features !== undefined &&
            !Array.isArray(updateData.features)
        ) {
            return res.status(400).json({
                success: false,
                message: "El campo 'features' debe ser un array",
            });
        }

        if (updateData.tags !== undefined && !Array.isArray(updateData.tags)) {
            return res.status(400).json({
                success: false,
                message: "El campo 'tags' debe ser un array",
            });
        }

        if (
            updateData.seller !== undefined ||
            updateData.sellerId !== undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "El comerciante asociado no puede cambiarse",
            });
        }

        const product = await Product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado",
            });
        }

        await populateProduct(product);

        res.status(200).json({
            success: true,
            message: "Producto actualizado exitosamente",
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el producto",
            error: error.message,
        });
    }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado",
            });
        }

        if (product.images?.length) {
            await deleteStoredImages(product.images);
        }

        if (product.seller) {
            await Seller.findByIdAndUpdate(product.seller, {
                $pull: { products: product._id },
            });
        }

        res.status(200).json({
            success: true,
            message: "Producto eliminado exitosamente",
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el producto",
            error: error.message,
        });
    }
};

// Subir imágenes de un producto
export const uploadProductImages = async (req, res) => {
    const { id } = req.params;
    const files = req.files || [];

    if (!files.length) {
        return res.status(400).json({
            success: false,
            message: "Debe adjuntar al menos una imagen",
        });
    }

    try {
        const product = await Product.findById(id);

        if (!product) {
            await removeUploadedFiles(files);
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado",
            });
        }

        const currentImages = product.images ?? [];
        if (currentImages.length + files.length > MAX_PRODUCT_IMAGES) {
            await removeUploadedFiles(files);
            return res.status(400).json({
                success: false,
                message: `Solo se permiten ${MAX_PRODUCT_IMAGES} imágenes por producto`,
            });
        }

        const relativePaths = files.map((file) =>
            relative(process.cwd(), file.path),
        );
        product.images = [...currentImages, ...relativePaths];
        await product.save();

        res.status(200).json({
            success: true,
            message: "Imágenes añadidas correctamente",
            data: product.images,
        });
    } catch (error) {
        await removeUploadedFiles(files);
        res.status(500).json({
            success: false,
            message: "Error al subir las imágenes",
            error: error.message,
        });
    }
};

// Eliminar una imagen de un producto
export const removeProductImage = async (req, res) => {
    const { id } = req.params;
    const { imagePath } = req.body;

    if (!imagePath) {
        return res.status(400).json({
            success: false,
            message: "Debe proporcionar el campo imagePath",
        });
    }

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado",
            });
        }

        const imageIndex = product.images.indexOf(imagePath);
        if (imageIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "La imagen indicada no pertenece al producto",
            });
        }

        const [removedImage] = product.images.splice(imageIndex, 1);
        await product.save();

        await deleteStoredImages([removedImage]);

        res.status(200).json({
            success: true,
            message: "Imagen eliminada correctamente",
            data: product.images,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar la imagen",
            error: error.message,
        });
    }
};
