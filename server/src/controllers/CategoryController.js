import Category from "../models/Category.js"; // Asegúrate de que la ruta sea correcta
import mongoose from "mongoose";

// 1. Crear una nueva Categoría
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validación básica
        if (!name) {
            return res
                .status(400)
                .json({ message: "El nombre de la categoría es requerido." });
        }

        // Crear una instancia de la categoría
        const newCategory = new Category({ name, description });

        // El middleware 'pre("save")' en el modelo generará automáticamente el 'slug'
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (error) {
        // Manejo de errores: por ejemplo, si el nombre ya existe (unique: true)
        if (error.code === 11000) {
            return res
                .status(400)
                .json({ message: "Esa categoría ya existe." });
        }
        res.status(500).json({
            message: "Error al crear la categoría.",
            error: error.message,
        });
    }
};

// 2. Obtener todas las Categorías
export const getCategories = async (req, res) => {
    try {
        // Ordenar por nombre alfabéticamente
        const categories = await Category.find().sort({ name: 1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener las categorías.",
            error: error.message,
        });
    }
};

// 3. Obtener una Categoría por ID
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        // Opcional: Validar si el ID es un ObjectId válido de Mongoose
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(404)
                .json({ message: "ID de categoría no válido." });
        }

        const category = await Category.findById(id);

        if (!category) {
            return res
                .status(404)
                .json({ message: "Categoría no encontrada." });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener la categoría.",
            error: error.message,
        });
    }
};

// 4. Actualizar una Categoría
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const updateFields = {};
        if (name !== undefined) {
            updateFields.name = name;
        }
        if (description !== undefined) {
            updateFields.description = description;
        }

        if (Object.keys(updateFields).length === 0) {
            return res
                .status(400)
                .json({
                    message: "No se proporcionaron campos para actualizar.",
                });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(404)
                .json({ message: "ID de categoría no válido." });
        }

        // Buscar y actualizar. 'new: true' devuelve el documento actualizado
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            updateFields,
            { new: true, runValidators: true, context: "query" }, // runValidators: asegura que se ejecuten las validaciones del esquema (como 'required')
        );

        if (!updatedCategory) {
            return res
                .status(404)
                .json({ message: "Categoría no encontrada." });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        if (error.code === 11000) {
            return res
                .status(400)
                .json({ message: "Ese nombre de categoría ya está en uso." });
        }
        res.status(500).json({
            message: "Error al actualizar la categoría.",
            error: error.message,
        });
    }
};

// 5. Eliminar una Categoría
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(404)
                .json({ message: "ID de categoría no válido." });
        }

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res
                .status(404)
                .json({ message: "Categoría no encontrada." });
        }

        // Opcional: Aquí podrías añadir lógica para manejar los productos
        // que tienen esta categoría. Podrías:
        // 1. Evitar la eliminación si hay productos asociados.
        // 2. Eliminar la referencia a esta categoría en todos los productos afectados.

        // Ejemplo simple (solo elimina la categoría)
        res.status(200).json({
            message: "Categoría eliminada con éxito.",
            category: deletedCategory,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar la categoría.",
            error: error.message,
        });
    }
};
