import fs from "fs";
import path from "path";
import multer from "multer";

const USERS_DIR = path.resolve("public/users");

const ensureUsersDir = () => {
    if (!fs.existsSync(USERS_DIR)) {
        fs.mkdirSync(USERS_DIR, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        ensureUsersDir();
        cb(null, USERS_DIR);
    },
    filename: (_req, file, cb) => {
        const timestamp = Date.now();
        const random = Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname) || ".png";
        const safeBase = path.basename(file.originalname, ext).replace(/\s+/g, "-").toLowerCase();
        cb(null, `${safeBase}-${timestamp}-${random}${ext}`);
    },
});

const fileFilter = (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Solo se permiten imágenes"));
    }
    cb(null, true);
};

export const uploadUserProfileImage = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
    },
});


