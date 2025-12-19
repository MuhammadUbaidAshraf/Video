const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.render('checkout', {
    title: 'Checkout',
    pageClass: 'checkout-page',
    layout: 'layout' 
  });
});


router.post('/', (req, res) => {
  res.redirect('/checkout/success');
});


router.get('/success', (req, res) => {
  res.render('checkout-success', {
    title: 'Order Confirmed',
    pageClass: 'success-page'
  });
});

module.exports = router;