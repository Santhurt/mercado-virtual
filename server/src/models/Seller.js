const sellerSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true, // Asumimos que el username debe ser único en la base de datos
        trim: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },
    sales: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    location: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        required: true,
        default: false,
    },
});

const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
