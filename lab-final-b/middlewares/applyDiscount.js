/**
 * Discount Middleware
 * Applies coupon-based discounts to order totals
 * This middleware is reusable and can be applied to any route
 */

const applyDiscount = (req, res, next) => {
    // Get coupon code from query parameter or request body
    const couponCode = req.query.coupon || req.body.coupon || '';
    
    // Initialize discount info in request object
    req.discountInfo = {
        applied: false,
        percentage: 0,
        amount: 0,
        code: couponCode.toUpperCase()
    };

    // Define available coupons
    const coupons = {
        'SAVE10': { percentage: 10, description: '10% off on total' },
        'SAVE20': { percentage: 20, description: '20% off on total' },
        'WELCOME15': { percentage: 15, description: '15% off for new customers' },
        'FREESHIP': { percentage: 0, description: 'Free shipping', freeShipping: true }
    };

    // Check if coupon code is valid
    if (req.discountInfo.code && coupons[req.discountInfo.code]) {
        const coupon = coupons[req.discountInfo.code];
        
        // Get subtotal from request (should be calculated before this middleware)
        const subtotal = req.body.subtotal || req.orderData?.subtotal || 0;
        
        if (coupon.freeShipping) {
            // Special handling for free shipping coupon
            req.discountInfo.applied = true;
            req.discountInfo.freeShipping = true;
            req.discountInfo.description = coupon.description;
        } else {
            // Calculate discount amount
            req.discountInfo.applied = true;
            req.discountInfo.percentage = coupon.percentage;
            req.discountInfo.amount = (subtotal * coupon.percentage) / 100;
            req.discountInfo.description = coupon.description;
        }
    }

    // Attach helper function to calculate final totals with discount
    req.calculateFinalTotal = (subtotal, shipping, tax) => {
        let finalShipping = shipping;
        let discount = 0;

        if (req.discountInfo.applied) {
            if (req.discountInfo.freeShipping) {
                finalShipping = 0;
            } else {
                discount = (subtotal * req.discountInfo.percentage) / 100;
            }
        }

        const total = subtotal + finalShipping + tax - discount;

        return {
            subtotal,
            shipping: finalShipping,
            tax,
            discount,
            total,
            couponApplied: req.discountInfo.applied,
            couponCode: req.discountInfo.code
        };
    };

    next();
};

module.exports = applyDiscount;
