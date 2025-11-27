import Cart from "../models/Cart.js";

export const getCart = async (req, res) => {
    try {
        const { userId, sessionId } = req.query;

        if (!userId && !sessionId) {
            return res.status(400).json({ message: "UserId or SessionId is required" });
        }

        const query = { status: "active" };
        if (userId) query.userId = userId;
        else query.sessionId = sessionId;

        let cart = await Cart.findOne(query);

        if (!cart) {
            cart = new Cart({ userId, sessionId, items: [] });
            await cart.save();
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { userId, sessionId, productId, title, price, quantity, image } = req.body;

        if (!userId && !sessionId) {
            return res.status(400).json({ message: "UserId or SessionId is required" });
        }

        const query = { status: "active" };
        if (userId) query.userId = userId;
        else query.sessionId = sessionId;

        let cart = await Cart.findOne(query);

        if (!cart) {
            cart = new Cart({ userId, sessionId, items: [] });
        }

        const itemIndex = cart.items.findIndex((item) => item.productId === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, title, price, quantity, image });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { userId, sessionId, productId, quantity } = req.body;

        if (!userId && !sessionId) {
            return res.status(400).json({ message: "UserId or SessionId is required" });
        }

        const query = { status: "active" };
        if (userId) query.userId = userId;
        else query.sessionId = sessionId;

        const cart = await Cart.findOne(query);

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex((item) => item.productId === productId);

        if (itemIndex > -1) {
            if (quantity > 0) {
                cart.items[itemIndex].quantity = quantity;
            } else {
                cart.items.splice(itemIndex, 1);
            }
            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: "Item not found in cart" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { userId, sessionId, productId } = req.body;

        if (!userId && !sessionId) {
            return res.status(400).json({ message: "UserId or SessionId is required" });
        }

        const query = { status: "active" };
        if (userId) query.userId = userId;
        else query.sessionId = sessionId;

        const cart = await Cart.findOne(query);

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter((item) => item.productId !== productId);
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const clearCart = async (req, res) => {
    try {
        const { userId, sessionId } = req.body;

        if (!userId && !sessionId) {
            return res.status(400).json({ message: "UserId or SessionId is required" });
        }

        const query = { status: "active" };
        if (userId) query.userId = userId;
        else query.sessionId = sessionId;

        const cart = await Cart.findOne(query);

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = [];
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
