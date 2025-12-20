const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { applyDiscount } = require('../middleware/discount');

router.post('/preview', applyDiscount, (req, res) => {
  try {
    const { cart, customer, payment, subtotal, shipping, tax } = req.body;
    
    if (!cart || cart.length === 0) {
      return res.redirect('/checkout?error=empty_cart');
    }

    const cartItems = JSON.parse(cart);
    
    const orderData = {
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      })),
      customer: JSON.parse(customer),
      payment: JSON.parse(payment),
      subtotal: parseFloat(subtotal),
      shipping: req.freeShipping ? 0 : parseFloat(shipping),
      tax: parseFloat(tax),
      discount: req.discount || 0,
      couponCode: req.couponCode || null,
      total: req.calculatedTotal
    };

    console.log('Order Data:', {
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      tax: orderData.tax,
      discount: orderData.discount,
      total: orderData.total,
      calculatedTotal: req.calculatedTotal
    });

    res.render('order-preview', {
      title: 'Order Preview - beVideo',
      orderData
    });
  } catch (error) {
    console.error('Error in order preview:', error);
    res.redirect('/checkout?error=preview_failed');
  }
});

router.post('/confirm', applyDiscount, async (req, res) => {
  try {
    const { cart, customer, payment, subtotal, shipping, tax } = req.body;

    if (!cart || cart.length === 0) {
      return res.redirect('/checkout?error=empty_cart');
    }

    const cartItems = JSON.parse(cart);
    const customerData = JSON.parse(customer);
    const paymentData = JSON.parse(payment);

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const cardDetails = paymentData.method === 'card' && paymentData.cardDetails 
      ? {
          cardholder: paymentData.cardDetails.cardholder,
          lastFourDigits: paymentData.cardDetails.cardnum ? 
            paymentData.cardDetails.cardnum.slice(-4) : '****'
        }
      : undefined;

    const order = new Order({
      orderNumber,
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      })),
      customer: customerData,
      payment: {
        method: paymentData.method,
        cardDetails
      },
      subtotal: parseFloat(subtotal),
      shipping: req.freeShipping ? 0 : parseFloat(shipping),
      tax: parseFloat(tax),
      discount: req.discount || 0,
      couponCode: req.couponCode || null,
      total: req.calculatedTotal,
      status: 'Placed'
    });

    await order.save();

    res.redirect(`/order/success?orderNumber=${orderNumber}`);
  } catch (error) {
    console.error('Error confirming order:', error);
    res.redirect('/checkout?error=order_failed');
  }
});

router.get('/success', async (req, res) => {
  try {
    const { orderNumber } = req.query;

    if (!orderNumber) {
      return res.redirect('/');
    }

    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return res.redirect('/?error=order_not_found');
    }

    res.render('order-success', {
      title: 'Order Success - beVideo',
      order
    });
  } catch (error) {
    console.error('Error loading success page:', error);
    res.redirect('/');
  }
});

module.exports = router;
