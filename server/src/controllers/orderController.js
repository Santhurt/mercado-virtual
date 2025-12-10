import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
    try {
        const orderData = req.body;

        // Validate that all products have a seller field
        if (orderData.products && orderData.products.length > 0) {
            const productsWithoutSeller = orderData.products.filter(p => !p.seller);
            if (productsWithoutSeller.length > 0) {
                return res.status(400).json({
                    message: "All products must have a seller assigned"
                });
            }
        }

        // Initial history entry
        orderData.history = [{
            status: orderData.status || 'pending',
            timestamp: new Date(),
            actorId: orderData.customerId
        }];

        const newOrder = new Order(orderData);
        await newOrder.save();

        // Populate references before sending response
        await newOrder.populate([
            { path: 'customerId', select: 'fullName email phone' },
            { path: 'products.productId', select: 'title price images' },
            { path: 'products.seller', select: 'businessName userId' }
        ]);

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id)
            .populate('customerId', 'fullName email phone')
            .populate('products.productId', 'title price images')
            .populate('products.seller', 'businessName userId');

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ customerId: userId })
            .populate('customerId', 'fullName email phone')
            .populate('products.productId', 'title price images')
            .populate('products.seller', 'businessName userId')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrdersBySeller = async (req, res) => {
    try {
        const { sellerId } = req.params;

        // Find all orders that contain at least one product from this seller
        const orders = await Order.find({
            'products.seller': sellerId
        })
            .populate('customerId', 'fullName email phone')
            .populate('products.productId', 'title price images')
            .populate('products.seller', 'businessName userId')
            .sort({ createdAt: -1 });

        // Filter each order to only include products from this seller
        const filteredOrders = orders.map(order => {
            const orderObj = order.toObject();
            orderObj.products = orderObj.products.filter(
                product => product.seller._id.toString() === sellerId
            );

            // Recalculate subtotal for this seller's products only
            orderObj.sellerSubtotal = orderObj.products.reduce(
                (sum, product) => sum + product.subtotal,
                0
            );

            return orderObj;
        });

        res.status(200).json(filteredOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, actorId } = req.body;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Validate status transition
        const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        order.status = status;
        order.history.push({
            status,
            timestamp: new Date(),
            actorId: actorId || 'system'
        });

        await order.save();

        // Populate references before sending response
        await order.populate([
            { path: 'customerId', select: 'fullName email phone' },
            { path: 'products.productId', select: 'title price images' },
            { path: 'products.seller', select: 'businessName userId' }
        ]);

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
