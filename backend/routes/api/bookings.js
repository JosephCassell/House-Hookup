const express = require('express');

const { Review, User, Spot, ReviewImage, Booking } = require('../../db/models'); 
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Op } = require("sequelize");


// Get all current user's bookings (in progress)
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id; 
    const bookings = await Booking.findAll({
        where: { userId: userId},
        attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
        include: [{
            model: Spot,
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage'],
        }]
    });
    
    const restructuredBooking = bookings.map(booking => {
        return {
            id: booking.id,
            spotId: booking.spotId,
            Spot: booking.Spot,
            userId: booking.userId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        };
    });

    res.status(200).json({ Bookings: restructuredBooking });
});
// Edit a booking
router.put('/:id', requireAuth, async (req, res) => {  
    const  bookingId  = req.params.id;
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
// Create a Booking from a Spot based on the Spot's id




module.exports = router;