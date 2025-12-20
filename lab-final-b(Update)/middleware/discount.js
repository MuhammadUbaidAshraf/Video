const applyDiscount = (req, res, next) => {
  const couponCode = req.body.couponCode || req.query.coupon || '';
  const subtotal = parseFloat(req.body.subtotal) || 0;
  const shipping = parseFloat(req.body.shipping) || 200;
  const tax = parseFloat(req.body.tax) || 0;
  
  let discount = 0;
  let validCoupon = null;
  let freeShipping = false;

  const coupons = {
    'SAVE10': { type: 'percentage', value: 10, description: '10% off' },
    'SAVE20': { type: 'percentage', value: 20, description: '20% off' },
    'FLAT50': { type: 'fixed', value: 50, description: 'PKR 50 off' },
    'FREESHIP': { type: 'shipping', value: 0, description: 'Free shipping' }
  };

  if (couponCode && coupons[couponCode.toUpperCase()]) {
    const coupon = coupons[couponCode.toUpperCase()];
    validCoupon = couponCode.toUpperCase();

    if (coupon.type === 'percentage') {
      discount = (subtotal * coupon.value) / 100;
    } else if (coupon.type === 'fixed') {
      discount = coupon.value;
    } else if (coupon.type === 'shipping') {
      freeShipping = true;
    }
  }

  req.discount = discount;
  req.couponCode = validCoupon;
  req.freeShipping = freeShipping;
  req.calculatedTotal = subtotal + (freeShipping ? 0 : shipping) + tax - discount;

  next();
};

module.exports = { applyDiscount };
