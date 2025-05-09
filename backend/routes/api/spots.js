'use strict';

const express = require('express');
const { Review, ReviewImage, User, Spot, SpotImage } = require('../../db/models');

const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator');
const { validateReview, handleValidationErrors } = require ('../../utils/validation');
const {Op} = require('sequelize');

const router = express.Router();

const validateSpot = [

    
    check('address')
    .notEmpty()
    .withMessage('Adress is required'),
    check('city')
    .notEmpty()
    .withMessage('City is required'),
    check('state')
    .notEmpty()
    .withMessage('State is required'),
    check('country')
    .notEmpty()
    .withMessage('Country is required'),
    check('lat')
    .isFloat({min: -90, max:90})
    .withMessage('Latitude must be between -90 and 90'),
    check('lng')
    .isFloat({min: -180, max: 180})
    .withMessage('Longitude must be between -180 and 180'),
    check('name')
    .isLength({min: 1, max: 50})
    .withMessage('Name length must be between 1 and 50 characters'),
    check('description')
    .notEmpty()
    .withMessage('Description is required'),
    check('price')
    .isDecimal({min: 0})
    .withMessage('Price must be positive'),
    handleValidationErrors   

];

const validateQueryFilters = [
    check('page')
    .optional()
    .isInt({min: 1}),
    check('size')
    .optional()
    .isInt({min: 1, max: 20}),
    handleValidationErrors
];


router.get('/', validateQueryFilters, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    
    const offset = (page - 1) * size; // adjust the page index 
                                     // since first page index is 0
    
    const spots = await Spot.findAll ({
        limit: size,
        offset: offset
    });

   return res.json({spots, page, size});
    
});

// GET /api/spots/:spotId/reviews - Get all reviews for a spot
router.get('/:spotId/reviews', async (req, res) => {
    try {
      const { spotId } = req.params;
  
      // Check if the spot exists
      const spot = await Spot.findByPk(spotId);
      if (!spot) {
        return res.status(404).json({ message: 'Spot not found' });
      }
  
      // Get all reviews for this spot
      const reviews = await Review.findAll({
        where: { spotId },
        include: [
          {
            model: User,
            attributes: ['id', 'username'],
          },
          {
            model: ReviewImage,
            attributes: ['id', 'url'],
          },
        ],
        order: [['createdAt', 'DESC']], // Newest reviews first
      });
  
      // Return the reviews
      res.json({ Reviews: reviews });
    } catch (error) {
      console.error('Error fetching reviews for spot:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

router.get('/current', requireAuth, async (req, res) => {

    const spots = await Spot.findAll ({
        where: { ownerId: req.user.id},
    })

    return res.json({ spots })

});

router.get('/:id', async (req, res) => {
    
    const spot = await Spot.findByPk(req.params.id);

    if (!spot) {
        return res.status(404).json({message: 'No spot'})
    }

    return res.json({ spot });

});

router.post('/', requireAuth, validateSpot, async (req, res) => {

    const { address, city, state, country, lat, lng, name, description, price} = req.body;

    const spot = await Spot.create({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
        ownerId: req.user.id, // Associate the current user as the owner
    })

    return res.status(201).json({ spot });

});

// POST /api/spots/:spotId/reviews - Create a new review for a spot
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
    try {
      const { spotId } = req.params;
      const userId = req.user.id;
      const { review, stars } = req.body;
  
      // Check if the spot exists
      const spot = await Spot.findByPk(spotId);
      if (!spot) {
        return res.status(404).json({ message: 'Spot not found' });
      }
  
      // Check if the user already has a review for this spot
      const existingReview = await Review.findOne({ where: { spotId, userId } });
      if (existingReview) {
        return res.status(500).json({ message: 'User already has a review for this spot' });
      }
  
      // Create a new review
      const newReview = await Review.create({
        spotId,
        userId,
        review,
        stars,
      });
  
      // Return the newly created review
      res.status(201).json(newReview);
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

router.post('/:id/images', requireAuth, async (req, res) => {

    const { id } = req.params;
    const {url, preview} = req.body;

    const spot = await Spot.findByPk(id);

    try {

    if (!spot) {
        return res.status(404).json({message: 'Spot not found'})
        
    }

    if (spot.ownerId  !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden'})
    }

    const spotImage = await SpotImage.create({
        spotId: id,
                url,
                preview
    })

    return res.status(201).json({
        id: spotImage.id,
        preview: spotImage.preview,
        url: spotImage.url
    });


} catch (errors) {

    console.error('Error adding images:', error);
    return res.status(500).json({ message: 'Internal server error' });
}
});

router.put('/:id', requireAuth, validateSpot, async (req, res) => {
    try {
    const { id } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.findByPk(id);
    if (!spot) {
        return res.status(404).json({ message: 'Spot not found' })
    }

    if (spot.ownerId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden'})
    }

    const updatedSpot = await spot.update({
        address, 
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price

    });

    return res.json(updatedSpot)

} catch (error) {
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ 
            message: 'Validation error',
            
     });
    }
    return res.status(500).json({
        message: 'Server Error'
    });
}

});

router.delete('/:id', requireAuth, async (req, res) => {

    const { id } = req.params;

    const spot = await Spot.findByPk(id);

    if (!spot) {
        return res.status(404).json({ message: 'Spot not found' });
    }

    if (spot.ownerId !== req.user.id) {
        return res.status(403).json({ message:'Forbidden'});
    }

    await spot.destroy();

    return res.json({message: "Success"})

});


module.exports = router;


