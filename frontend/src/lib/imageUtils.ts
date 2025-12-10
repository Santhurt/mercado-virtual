// Helper function to build full image URLs from relative paths
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Converts a relative image path to a full URL
 * @param imagePath - Relative path like 'public/products/product-xxx.jpg'
 * @returns Full URL like 'http://localhost:3000/public/products/product-xxx.jpg'
 */
export const getImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) {
        return "https://placehold.co/200";
    }

    // If already a full URL, return as-is
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
    }

    // Build full URL from relative path
    return `${API_URL}/${imagePath}`;
};

/**
 * Gets the first image URL from an array of image paths
 * @param images - Array of relative image paths
 * @returns Full URL of the first image, or placeholder
 */
export const getFirstImageUrl = (images: string[] | undefined): string => {
    if (!images || images.length === 0) {
        return "https://placehold.co/200";
    }
    return getImageUrl(images[0]);
};
