//miniapp
const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.render('index', {
    title: 'beVideo - Professional Video Production',
    metaDescription: 'Professional video production services',
    pageClass: 'home-page'
  });
});


router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About beVideo',
    pageClass: 'about-page'
  });
});


router.get('/portfolio', (req, res) => {
  res.render('portfolio', {
    title: 'Our Portfolio',
    pageClass: 'portfolio-page'
  });
});


module.exports = router;