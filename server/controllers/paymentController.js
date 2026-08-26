const Order = require("../models/Order");
const Product = require("../models/Product");
const khaltiService = require("../services/khaltiService");
const sendResponse = require("../utils/apiResponse");
const AppError = require("../utils/AppError");

exports.initiateKhaltiPayment = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return next(new AppError("No order items", 400));
    }

    if (!shippingAddress) {
      return next(new AppError("Shipping address is required", 400));
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
      paymentMethod: "Khalti",
      paymentStatus: "Pending",
      orderStatus: "Pending",
      subtotal,
      shippingCost,
      totalPrice,
    });

    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    const amountInPaisa = Math.round(totalPrice * 100);

    const paymentResult = await khaltiService.initiatePayment({
      amount: amountInPaisa,
      orderId: order._id.toString(),
      orderName: `Order ${order._id}`,
      customerInfo: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
      },
    });

    if (!paymentResult.success) {
      order.paymentStatus = "Failed";
      order.orderStatus = "Cancelled";
      await order.save();

      for (const item of items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }

      return next(new AppError("Payment initiation failed: " + paymentResult.message, 400));
    }

    order.paymentInfo = {
      provider: "Khalti",
      pidx: paymentResult.pidx,
    };
    await order.save();

    sendResponse(res, 200, true, "Payment initiated", {
      payment_url: paymentResult.payment_url,
      pidx: paymentResult.pidx,
      orderId: order._id,
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyKhaltiPayment = async (req, res, next) => {
  try {
    const { pidx } = req.body;

    if (!pidx) {
      return next(new AppError("Payment identifier (pidx) is required", 400));
    }

    const verificationResult = await khaltiService.verifyPayment(pidx);

    if (!verificationResult.success) {
      return next(new AppError("Payment verification failed: " + verificationResult.message, 400));
    }

    const order = await Order.findOne({ "paymentInfo.pidx": pidx });

    if (!order) {
      return next(new AppError("Order not found for this payment", 404));
    }

    if (order.paymentStatus === "Paid") {
      return sendResponse(res, 200, true, "Payment already verified", order);
    }

    if (verificationResult.status === "Completed") {
      order.paymentStatus = "Paid";
      order.orderStatus = "Processing";
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentInfo.transactionId = verificationResult.transactionId;
      order.paymentInfo.status = "Completed";
      await order.save();
    } else {
      order.paymentStatus = "Failed";
      order.paymentInfo.status = verificationResult.status;
      await order.save();

      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    sendResponse(res, 200, true, "Payment verified", order);
  } catch (error) {
    next(error);
  }
};
