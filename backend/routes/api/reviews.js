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
// Edit a review
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
    if (!existingReview) return res.status(404).json({ message: "Review couldn't be found" });
    if (existingReview.userId !== userId) return res.status(403).json({ message: "You do not have permission to edit this review" });
  
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
// Get all reviews of current user
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
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'avgRating', 'previewImage']
            }),
            ReviewImage.findAll({
                where: {reviewId: reviewIds},
                attributes: ['id', 'reviewId', 'url']
            })
        ]);

        const spotMap = spots.reduce((map, spot) => {
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
// Delete a review
router.delete('/:id', requireAuth, async (req, res) => {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({message: "Review couldn't be found"});
    if (review.userId !== req.user.id) return res.status(403).json({ message: "You do not have permission to delete this Review" });
    
    await review.destroy();
    
    res.status(200).json({ message: "Successfully deleted"});
});

module.exports = router;