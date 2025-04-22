'use strict';

const express = require('express');
const { Review, ReviewImage, User, Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { validateReview } = require ('../../utils/validation');
const { Op } = require('sequelize');

const router = express.Router();

// **Validation middleware for reviews**
// const validateReview = [
//   check('reviews')
//     .exists({ checkFalsy: true })
//     .withMessage('Review text is required'),
//   check('stars')
//     .exists({ checkFalsy: true })
//     .isInt({ min: 1, max: 5 })
//     .withMessage('Stars must be an integer between 1 and 5'),
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   },
// ];


router.get('/current', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const reviews = await Review.findAll({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        },
        {
          model: Spot,
          attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
          include: [
            {
              model: SpotImage,
              attributes: ['url'],
              where: { preview: true },
              required: false,
            },
          ],
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url'],
        },
      ],
    });

    
    const formattedReviews = reviews.map(review => {
      const reviewData = review.toJSON();
      reviewData.Spot.previewImage = reviewData.Spot.SpotImages?.length > 0 ? reviewData.Spot.SpotImages[0].url : null;
      delete reviewData.Spot.SpotImages; 
      return reviewData;
    });

    res.json({ Reviews: formattedReviews });
  } catch (error) {
    console.error('Error fetching current user reviews:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



router.post('/:reviewId/images', requireAuth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { url } = req.body;
    const userId = req.user.id;

    const review = await Review.findByPk(reviewId, {
      include: [ReviewImage],
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    
    if (review.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this review' });
    }

    
    if (review.ReviewImages.length  >= 10) {
      return res.status(403).json({ message: 'Maximum number of images for this review reached (10)' });
    }

    
    const newImage = await ReviewImage.create({ reviewId, url });

    res.status(201).json({
      id: newImage.id,
      url: newImage.url,
    });
  } catch (error) {
    console.error('Error adding review image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { review, stars } = req.body;
      const userId = req.user.id;
  
      
      const existingReview = await Review.findByPk(reviewId);
  
      
      if (!existingReview) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      
      if (existingReview.userId !== userId) {
        return res.status(403).json({ message: 'Forbidden: You do not own this review' });
      }
  
      
      existingReview.review = review;
      existingReview.stars = stars;
      await existingReview.save(); 
  
      
      res.json(existingReview);
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


router.delete('/:reviewId', requireAuth, async (req, res) => {
    try {
      const { reviewId } = req.params;
      const userId = req.user.id;
  
      
      const review = await Review.findByPk(reviewId);
  
      
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      
      if (review.userId !== userId) {
        return res.status(403).json({ message: 'Forbidden: You do not own this review' });
      }
  
    
      await review.destroy();
  
      
      res.json({ message: 'Successfully deleted review' });
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  


module.exports = router;
