const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.render('crud', {
    title: 'CRUD Operations',
    pageClass: 'crud-page',
    layout: 'layout' // Or create 'admin-layout.ejs'
  });
});



// Get all posts (proxied from JSONPlaceholder)
router.get('/api/posts', async (req, res) => {
  // In production, this would query your database
  res.json({ message: 'This will fetch from your database' });
});

// Create post
router.post('/api/posts', async (req, res) => {
  // req.body contains form data
  // Validate and save to database
  res.json({ message: 'Post created', data: req.body });
});

// Update post
router.put('/api/posts/:id', async (req, res) => {
  // req.params.id = post ID from URL
  // req.body = updated data
  res.json({ message: `Post ${req.params.id} updated` });
});

// Delete post
router.delete('/api/posts/:id', async (req, res) => {
  res.json({ message: `Post ${req.params.id} deleted` });
});

module.exports = router;