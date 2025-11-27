import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
    try {
        const orderData = req.body;

        // Initial history entry
        orderData.history = [{
            status: orderData.status || 'pending',
            timestamp: new Date(),
            actorId: orderData.customerId
        }];

        const newOrder = new Order(orderData);
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
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
        const orders = await Order.find({ customerId: userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
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

        order.status = status;
        order.history.push({
            status,
            timestamp: new Date(),
            actorId: actorId || 'system'
        });

        await order.save();
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
