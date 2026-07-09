import Order from "../model/Order.js";
import Product from "../model/Product.js";

// Helper: calculate prices
const calcPrices = (orderItems) => {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingPrice = itemsPrice > 999 ? 0 : 60; // free shipping above ₹999
  const taxPrice = parseFloat((0.18 * itemsPrice).toFixed(2)); // 18% GST
  const totalPrice = parseFloat(
    (itemsPrice + shippingPrice + taxPrice).toFixed(2)
  );
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    // Validate products exist and have enough stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.product}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${product.name}. Available: ${product.stock}`,
        });
      }
    }

    const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
      calcPrices(orderItems);

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    const createdOrder = await order.save();


    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("ORDER ERROR:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name imageUrl");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Allow only the order owner or an admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    console.error("ORDER ERROR:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: "Order is already paid" });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      status,
    } = req.body;

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      status,
      paidAt: Date.now(),
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error("ORDER ERROR:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.isPaid) {
      return res
        .status(400)
        .json({ message: "Order must be paid before marking as delivered" });
    }

    if (order.isDelivered) {
      return res.status(400).json({ message: "Order is already delivered" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.orderStatus = "Delivered";

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error("ORDER ERROR:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    console.error("ORDER ERROR:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("ORDER ERROR:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Cancel an order (user can cancel their own order if still processing)
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Ensure the logged-in user owns this order
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        // Only allow cancellation if not already shipped/delivered/cancelled
        if (['Shipped', 'Delivered', 'Cancelled'].includes(order.orderStatus)) {
            return res.status(400).json({ message: `Order cannot be cancelled once it is ${order.status}` });
        }

        order.orderStatus = 'Cancelled';
        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } catch (error) {
        console.error("Cancel order error:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};



export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getAllOrders,
  cancelOrder
};