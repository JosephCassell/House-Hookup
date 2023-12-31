const express = require('express');

const { Review, User, Spot, ReviewImage } = require('../../db/models'); 
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Op } = require("sequelize");

const validateReviews = (body) => {
    const errors = {};
    if(!body.review) errors.review = "Review text is required"
    if(!body.stars || body.stars < 1 || body.stars > 5) errors.stars = "Stars must be an integer from 1 to 5"
  
    return Object.keys(errors).length === 0 ? null : errors;
  };
// Edit a Review
router.put('/:id', requireAuth, async (req, res) => {  
      const  reviewId  = req.params.id;
      const { review, stars } = req.body;
      const userId = req.user.id;
  
      const errors = validateReviews(req.body);
  
    if (errors) {
    return res.status(400).json({
      message: "Bad Request",
      errors: errors
      });
    }
    
    const existingReview = await Review.findByPk(reviewId);
    
    if (!existingReview) return res.status(404).json({ 
        message: "Review couldn't be found" 
    });
    
    if (existingReview.userId !== userId) return res.status(403).json({ 
        message: "Forbidden" 
    });
  
    const updatedReview = await existingReview.update({
        review,
        stars
    })
  
    res.status(200).json({
        id: updatedReview.id,
        userId: updatedReview.userId,
        spotId: updatedReview.spotId,
        review: updatedReview.review,
        stars: updatedReview.stars,
        createdAt: updatedReview.createdAt,
        updatedAt: updatedReview.updatedAt
      });
  });
// Get all Reviews of the Current User
  router.get('/current', requireAuth, async (req, res) => {
        const reviews = await Review.findAll({
            where: { userId: req.user.id },
            attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt'],
            include: [{
                model: User,
                attributes: ['id', 'firstName', 'lastName'],
            }]
        });

        const spotIds = reviews.map(review => review.spotId);
        const reviewIds = reviews.map(review => review.id);
        
        const [spots, reviewImages] = await Promise.all([
            Spot.findAll({
                where: {id: spotIds},
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'previewImage']
            }),
            ReviewImage.findAll({
                where: {reviewId: reviewIds},
                attributes: ['id', 'reviewId', 'url']
            })
        ]);
        const convertedSpots = spots.map(spot => ({
            ...spot.get({ plain: true }),
            lat: parseFloat(spot.lat),
            lng: parseFloat(spot.lng),
            price: parseFloat(spot.price)
        }));
        const spotMap = convertedSpots.reduce((map, spot) => {
            map[spot.id] = spot;
            return map;
        }, {});

        const reviewImageMap = reviewImages.reduce((map, image) => {
            if (!map[image.reviewId]) map[image.reviewId] = [];
            map[image.reviewId].push({
                id: image.id,
                url: image.url
            });
            return map;
        }, {});

        reviews.forEach(review => {
            review.dataValues.Spot = spotMap[review.spotId];
            review.dataValues.ReviewImages = reviewImageMap[review.id] || 'No Images';
        });
        res.status(200).json({Reviews: reviews});
});
// Delete a Review
router.delete('/:id', requireAuth, async (req, res) => {
    const review = await Review.findByPk(req.params.id);
    
    if (!review) return res.status(404).json({
        message: "Review couldn't be found"
    });

    if (review.userId !== req.user.id) return res.status(403).json({
        message: "Forbidden" 
    });
    
    await review.destroy();
    
    res.status(200).json({ message: "Successfully deleted"});
});
//Add an Image to a Review based on the Review's id
router.post('/:id/images', requireAuth, async (req, res) => { 
    const reviewId = req.params.id;
    const url = req.body.url;
  
    
    const review = await Review.findByPk(reviewId);
    
    if (!review) {
        return res.status(404).json({ message: "Review not found" });
    }
    
    if(review.userId !== req.user.id) {
      return res.status(403).json({ 
        message: "You do not have permission to add an image to this review" 
      });
    } 
    
    const numImages = await ReviewImage.count({where: {reviewId}})
    
    if (numImages >= 10) return res.status(403).json({
        "message": "Maximum number of images for this resource was reached"
    })
    
    const newImage = await ReviewImage.create({
        url: url,
        reviewId: reviewId
    });
  
    res.status(200).json({
        id: newImage.id,
        url: newImage.url
    });
  })

module.exports = router;