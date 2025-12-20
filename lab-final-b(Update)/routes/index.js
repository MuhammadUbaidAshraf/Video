const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ featured: -1, createdAt: -1 }).limit(6);

    const testimonials = [
      {
        name: 'Asim',
        rating: 4.2,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Field_Marshal_Asim_Munir.jpg/120px-Field_Marshal_Asim_Munir.jpg',
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta in cumque alias officia expedita ut? Odit blanditiis aspernatur dolore numquam, labore voluptatem! Autem ea culpa minima deserunt dolorem nobis illo?'
      },
      {
        name: 'Qamar',
        rating: 4.3,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/General_Qamar_Javed_Bajwa.jpg/120px-General_Qamar_Javed_Bajwa.jpg',
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt totam voluptate facere! Eum ea iste asperiores neque iure delectus ducimus quos pariatur deleniti, quo impedit veritatis beatae labore ad quam!'
      },
      {
        name: 'Raaheel',
        rating: 4.7,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/General_Raheel_Sharif.jpg/120px-General_Raheel_Sharif.jpg',
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia facilis ad hic ratione quod commodi sapiente harum autem atque quaerat modi odit, possimus aspernatur magnam numquam ab vel ut assumenda!'
      },
      {
        name: 'Pervaiz',
        rating: 4.6,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Pervez_Musharraf_2004.jpg/120px-General_Raheel_Sharif.jpg',
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus deserunt aspernatur soluta, cupiditate impedit esse molestiae consectetur quidem est dolore illum, aliquid beatae error recusandae fugit officiis nam eaque quis!'
      },
      {
        name: 'Muhammad Zia',
        rating: 3.5,
        image: 'https://i.guim.co.uk/img/media/93000f2568af365b8bf70dd8af20913ebc30a20e/0_529_2076_1245/master/2076.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=c4ba4addd67a1bd73ef09fd381144081',
        text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi, dignissimos ad? Voluptate id reiciendis quaerat accusantium molestias officiis, fugit ratione nostrum odio alias suscipit ducimus enim animi ipsum, ea doloribus?'
      }
    ];

    res.render('index', { 
      title: 'beVideo - Home',
      products,
      testimonials
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.render('index', { 
      title: 'beVideo - Home',
      products: [],
      testimonials: []
    });
  }
});

module.exports = router;
