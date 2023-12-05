const express = require('express');

const { Review } = require('../../db/models'); 
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

module.exports = router;