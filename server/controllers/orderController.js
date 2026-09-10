const Order = require("../models/Order");
const Product = require("../models/Product");
const sendResponse = require("../utils/apiResponse");
const AppError = require("../utils/AppError");
const emailService = require("../services/emailService");

exports.createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return next(new AppError("No order items", 400));
    }

    if (!shippingAddress || !paymentMethod) {
      return next(new AppError("Shipping address and payment method are required", 400));
    }

    let subtotal = 0;
    const items = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return next(new AppError(`Product not found: ${item.product}`, 404));
      }
      if (product.stock < item.quantity) {
        return next(new AppError(`Insufficient stock for ${product.name}`, 400));
      }

      const price = product.discountPrice > 0 ? product.discountPrice : product.price;
      subtotal += price * item.quantity;

      items.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || "",
        price,
        quantity: item.quantity,
      });
    }

    const shippingCost = subtotal >= 1000 ? 0 : 100;
    const totalPrice = subtotal + shippingCost;

    const order = await Order.create({
      user: req.user._id,
      orderItems: items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      totalPrice,
    });

    for (const item of items) {
      const updatedProduct = await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      }, { new: true });

      if (req.app.get("io") && updatedProduct) {
        req.app.get("io").to(`product-${item.product}`).emit("stock-update", {
          productId: item.product,
          stock: updatedProduct.stock,
        });
      }
    }

    await order.populate("user", "name email phone");

    const customerEmail = req.user.email || order.shippingAddress.email;
    emailService.sendOrderConfirmationEmail(customerEmail, {
      name: order.shippingAddress.fullName || req.user.name,
      orderId: order._id.toString().slice(-8).toUpperCase(),
      items: order.orderItems,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      totalPrice: order.totalPrice,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
    });

    sendResponse(res, 201, true, "Order created", order);
  } catch (error) {
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const total = await Order.countDocuments({ user: req.user._id });
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    sendResponse(res, 200, true, "Orders fetched", {
      orders,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email phone");

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return next(new AppError("Not authorized", 403));
    }

    sendResponse(res, 200, true, "Order fetched", order);
  } catch (error) {
    next(error);
  }
};
