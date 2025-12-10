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

        let cart = await Cart.findOne(query)
            .populate('userId', 'fullName email')
            .populate('items.seller', 'businessName userId')
            .populate('items.productId', 'title price images stock');

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
        const { userId, sessionId, productId, seller, title, price, quantity, image } = req.body;

        if (!userId && !sessionId) {
            return res.status(400).json({ message: "UserId or SessionId is required" });
        }

        if (!seller) {
            return res.status(400).json({ message: "Seller is required for cart items" });
        }

        if (!productId || !title || !price || !quantity) {
            return res.status(400).json({
                message: "Missing required fields: productId, title, price, quantity"
            });
        }

        const query = { status: "active" };
        if (userId) query.userId = userId;
        else query.sessionId = sessionId;

        let cart = await Cart.findOne(query);

        if (!cart) {
            cart = new Cart({ userId, sessionId, items: [] });
        }

        // Find item by both productId and seller to support same product from different sellers
        const itemIndex = cart.items.findIndex(
            (item) => item.productId === productId && item.seller.toString() === seller
        );

        if (itemIndex > -1) {
            // Update quantity if item already exists from same seller
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Add new item with seller reference
            cart.items.push({ productId, seller, title, price, quantity, image });
        }

        await cart.save();

        // Populate references before sending response
        await cart.populate([
            { path: 'userId', select: 'fullName email' },
            { path: 'items.seller', select: 'businessName userId' },
            { path: 'items.productId', select: 'title price images stock' }
        ]);

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { userId, sessionId, productId, seller, quantity } = req.body;

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

        // Find item by productId and optionally by seller if provided
        const itemIndex = cart.items.findIndex((item) => {
            if (seller) {
                return item.productId === productId && item.seller.toString() === seller;
            }
            return item.productId === productId;
        });

        if (itemIndex > -1) {
            if (quantity > 0) {
                cart.items[itemIndex].quantity = quantity;
            } else {
                // Remove item if quantity is 0 or negative
                cart.items.splice(itemIndex, 1);
            }
            await cart.save();

            // Populate references before sending response
            await cart.populate([
                { path: 'userId', select: 'fullName email' },
                { path: 'items.seller', select: 'businessName userId' },
                { path: 'items.productId', select: 'title price images stock' }
            ]);

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
        const { userId, sessionId, productId, seller } = req.body;

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

        // Filter items by productId and optionally by seller if provided
        cart.items = cart.items.filter((item) => {
            if (seller) {
                return !(item.productId === productId && item.seller.toString() === seller);
            }
            return item.productId !== productId;
        });

        await cart.save();

        // Populate references before sending response
        await cart.populate([
            { path: 'userId', select: 'fullName email' },
            { path: 'items.seller', select: 'businessName userId' },
            { path: 'items.productId', select: 'title price images stock' }
        ]);

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

// New function to get cart items grouped by seller
export const getCartBySeller = async (req, res) => {
    try {
        const { userId, sessionId } = req.query;

        if (!userId && !sessionId) {
            return res.status(400).json({ message: "UserId or SessionId is required" });
        }

        const query = { status: "active" };
        if (userId) query.userId = userId;
        else query.sessionId = sessionId;

        let cart = await Cart.findOne(query)
            .populate('userId', 'fullName email')
            .populate('items.seller', 'businessName userId')
            .populate('items.productId', 'title price images stock');

        if (!cart || cart.items.length === 0) {
            return res.status(200).json({ sellers: [] });
        }

        // Group items by seller
        const groupedBySeller = cart.items.reduce((acc, item) => {
            const sellerId = item.seller._id.toString();

            if (!acc[sellerId]) {
                acc[sellerId] = {
                    seller: item.seller,
                    items: [],
                    subtotal: 0
                };
            }

            acc[sellerId].items.push(item);
            acc[sellerId].subtotal += item.price * item.quantity;

            return acc;
        }, {});

        const sellers = Object.values(groupedBySeller);

        res.status(200).json({
            cartId: cart._id,
            userId: cart.userId,
            sellers,
            totalPrice: cart.totalPrice,
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

