const express = require('express');
const router = express.Router();
const Order = require('../model/Order');
const applyDiscount = require('../middlewares/applyDiscount');

/**
 * GET /order/preview
 * Display order preview with cart items and totals
 */
router.get('/preview', applyDiscount, (req, res) => {
    res.render('order-preview', {
        title: 'Order Preview',
        metaDescription: 'Review your order',
        pageClass: 'order-preview-page',
        discountInfo: req.discountInfo,
        layout: 'layout'
    });
});

/**
 * POST /order/preview
 * Process order preview with customer data and cart items
 */
router.post('/preview', applyDiscount, (req, res) => {
    try {
        const { 
            fullname, 
            email, 
            phone, 
            address, 
            city, 
            postal, 
            country,
            payment,
            cardholder,
            cardnum,
            items,
            subtotal,
            shipping,
            tax
        } = req.body;

        // Calculate final totals with discount
        const totals = req.calculateFinalTotal(
            parseFloat(subtotal) || 0,
            parseFloat(shipping) || 0,
            parseFloat(tax) || 0
        );

        // Parse cart items
        let cartItems = [];
        try {
            cartItems = typeof items === 'string' ? JSON.parse(items) : items;
        } catch (e) {
            cartItems = [];
        }

        // Prepare order data for preview
        const orderData = {
            customerInfo: {
                fullname,
                email,
                phone,
                address,
                city,
                postal,
                country
            },
            items: cartItems,
            paymentMethod: payment,
            cardDetails: payment === 'card' ? {
                cardholder,
                lastFourDigits: cardnum ? cardnum.slice(-4) : ''
            } : null,
            pricing: totals
        };

        res.render('order-preview', {
            title: 'Order Preview',
            metaDescription: 'Review your order',
            pageClass: 'order-preview-page',
            orderData,
            discountInfo: req.discountInfo,
            layout: 'layout'
        });

    } catch (error) {
        console.error('Error processing order preview:', error);
        res.status(500).render('error', {
            title: 'Error',
            metaDescription: 'An error occurred',
            pageClass: 'error-page',
            message: 'Failed to process order preview',
            error: error
        });
    }
});

/**
 * POST /order/confirm
 * Finalize and save order to database
 */
router.post('/confirm', applyDiscount, async (req, res) => {
    try {
        const {
            fullname,
            email,
            phone,
            address,
            city,
            postal,
            country,
            payment,
            cardholder,
            cardnum,
            items,
            subtotal,
            shipping,
            tax
        } = req.body;

        // Calculate final totals with discount
        const totals = req.calculateFinalTotal(
            parseFloat(subtotal) || 0,
            parseFloat(shipping) || 0,
            parseFloat(tax) || 0
        );

        // Parse cart items
        let cartItems = [];
        try {
            cartItems = typeof items === 'string' ? JSON.parse(items) : items;
        } catch (e) {
            return res.status(400).json({ error: 'Invalid cart items' });
        }

        // Create order object
        const order = new Order({
            customerInfo: {
                fullname,
                email,
                phone,
                address,
                city,
                postal,
                country
            },
            items: cartItems.map(item => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                subtotal: item.price * item.quantity
            })),
            paymentMethod: payment,
            cardDetails: payment === 'card' ? {
                cardholder,
                lastFourDigits: cardnum ? cardnum.slice(-4) : ''
            } : undefined,
            pricing: {
                subtotal: totals.subtotal,
                shipping: totals.shipping,
                tax: totals.tax,
                discount: totals.discount,
                couponCode: totals.couponApplied ? totals.couponCode : undefined,
                total: totals.total
            },
            status: 'Placed'
        });

        // Save order to database
        const savedOrder = await order.save();

        // Redirect to success page with order details
        res.redirect(`/order/success?orderId=${savedOrder._id}`);

    } catch (error) {
        console.error('Error confirming order:', error);
        res.status(500).render('error', {
            title: 'Error',
            metaDescription: 'An error occurred',
            pageClass: 'error-page',
            message: 'Failed to place order',
            error: error
        });
    }
});

/**
 * GET /order/success
 * Display order confirmation page
 */
router.get('/success', async (req, res) => {
    try {
        const { orderId } = req.query;

        if (!orderId) {
            return res.redirect('/');
        }

        // Fetch order from database
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).render('error', {
                title: 'Order Not Found',
                metaDescription: 'Order not found',
                pageClass: 'error-page',
                message: 'Order not found'
            });
        }

        res.render('order-success', {
            title: 'Order Confirmed',
            metaDescription: 'Your order has been confirmed',
            pageClass: 'order-success-page',
            order,
            layout: 'layout'
        });

    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).render('error', {
            title: 'Error',
            metaDescription: 'An error occurred',
            pageClass: 'error-page',
            message: 'Failed to retrieve order',
            error: error
        });
    }
});

module.exports = router;
