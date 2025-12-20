const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const products = [
    {
      id: 'prod1',
      name: 'Video Editing Software',
      description: 'Professional editing suite for creators.',
      price: 99.99,
      image: 'https://ih1.redbubble.net/image.325764859.0459/icr,iphone_17_toughmagsafe,back,a,x1000-pad,1000x1000,f8f8f8.u2.jpg'
    },
    {
      id: 'prod2',
      name: '4K Camera Lens',
      description: 'Capture stunning clarity with this lens.',
      price: 499.00,
      image: 'https://preview.redd.it/what-would-be-your-response-if-you-saw-a-black-vigo-at-your-v0-xai5rw6bzs0b1.png?width=650&format=png&auto=webp&s=decd08e41cbe7ce39a8f7a40a786308b740388dc'
    },
    {
      id: 'prod3',
      name: 'Tripod Stand',
      description: 'Stable and portable tripod for all setups.',
      price: 55.50,
      image: 'https://houseofscotland.pk/cdn/shop/products/house-of-scotland-military-officer-stick-with-chain-36-inches.jpg?v=1678706156&width=1200'
    }
  ];

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
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Pervez_Musharraf_2004.jpg/120px-Pervez_Musharraf_2004.jpg',
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
});

module.exports = router;
