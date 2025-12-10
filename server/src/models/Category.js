import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
    {
        // Nombre de la categoría (ej: "Electrónica", "Ropa", "Libros")
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true, // Asegura que no haya categorías con el mismo nombre
        },
        // Un slug para URLs amigables (opcional, pero buena práctica)
        slug: {
            type: String,
            lowercase: true,
            unique: true,
        },
    },
    { timestamps: true },
);

// Middleware para generar el slug antes de guardar (si lo deseas)
categorySchema.pre("save", function () {
    if (this.isModified("name")) {
        // Simple slug generation: replace spaces with hyphens and convert to lowercase
        this.slug = this.name.split(" ").join("-").toLowerCase();
    }
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
