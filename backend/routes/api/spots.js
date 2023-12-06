const express = require('express');
const { Review, User, Spot, ReviewImage, Booking } = require('../../db/models'); 
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Op } = require("sequelize");

const validateReviews = (body) => {
  const errors = {};
  if(!body.review) errors.review = "Review text is required"
  if(!body.stars || body.stars < 1 || body.stars > 5) errors.stars = "Stars must be an integer from 1 to 5"

  return Object.keys(errors).length === 0 ? null : errors;
};
const validateQuery = (body) => {
  const errors = {};
  if(body.page < 1) errors.page = "Page must be greater than or equal to 1";
  if(body.size < 1) errors.size = "Size must be greater than or equal to 1";
  if(body.maxLat && isNaN(body.maxLat)) errors.maxLat = "Maximum latitude is invalid";
  if(body.minLat && isNaN(body.minLat)) errors.minLat = "Minimum latitude is invalid";
  if(body.maxLng && isNaN(body.minLng)) errors.minLng = "Maximum longitude is invalid";
  if(body.minLng && isNaN(body.maxLng)) errors.maxLng = "Minimum longitude is invalid";
  if(body.minPrice < 0) errors.minPrice = "Minimum price must be greater than or equal to 0";
  if(body.maxPrice < 0) errors.maxPrice = "Maximum price must be greater than or equal to 0";
  
  return Object.keys(errors).length === 0 ? null : errors;
}
const validateSpot = (body) => {
  const errors = {};
  if (!body.address) errors.address = "Street address is required";
  if (!body.city) errors.city = "City is required";
  if (!body.state) errors.state = "State is required";
  if (!body.country) errors.country = "Country is required";
  if (!body.lat || isNaN(body.lat) || body.lat < -90 || body.lat > 90) errors.lat = "Latitude is not valid";
  if (!body.lng || isNaN(body.lng)|| body.lng < -180 || body.lng > 180) errors.lng = "Longitude is not valid";
  if (body.name && body.name.length > 50) errors.name = "Name must be less than 50 characters";
  if (!body.description) errors.description = "Description is required";
  if (isNaN((body.price))) errors.price = "Price per day is required";

  return Object.keys(errors).length === 0 ? null : errors;
};
const findTheFilters = (filter) => {
  const where = {};
  if (filter.minLat !== undefined && filter.maxLat !== undefined) {
    where.lat = {
      [Op.between]: [filter.minLat, filter.maxLat]
    };
  }
  if (filter.minLng !== undefined && filter.maxLng !== undefined) {
    where.lng = {
      [Op.between]: [filter.minLng, filter.maxLng]
    };
  }
  if (filter.minPrice !== undefined && filter.maxPrice !== undefined) {
    where.price = {
      [Op.between]: [filter.minPrice,filter.maxPrice]
    };
  }
  
  return Object.keys(where).length === 0 ? null : where;
}
// Get all spots
// Add query fitler to get all spots
router.get('/', async (req, res) => {
  let { minLat, maxLat, page, size, maxLng, minLng, minPrice, maxPrice} = req.query;
  const errors = validateQuery(req.query)
  if (errors) {
    return res.status(400).json({
      message: "Bad Request",
      errors: errors
    });
  } 
  if (!page) page = 1;
  if (!size) size = 20; 
  const where = findTheFilters(req.query)
  if (where) {
    const spotted = await Spot.findAll({
      where, 
      limit: size,
      offset: (page - 1) * size
    });
  return res.status(200).json({
    spotted,
    page,
    size
  });
  } else {
    const Spots = await Spot.findAll({
      attributes: [
        'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name',
        'description', 'price', 'createdAt', 'updatedAt', 'avgRating', 'previewImage',
        ],
      });
      res.status(200).json({ 
        Spots,
        page,
        size
      });
  }
});
// Create a spot
router.post('/', requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const errors = validateSpot(req.body);
  if (errors) {
    return res.status(400).json({
      message: "Bad Request",
      errors: errors
    });
  }

    const newSpot = await Spot.create({
      ownerId: req.user.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });
    res.status(201).json({
      id: newSpot.id,
      ownerId: newSpot.ownerId,
      address: newSpot.address,
      city: newSpot.city,
      state: newSpot.state,
      country: newSpot.country,
      lat: newSpot.lat,
      lng: newSpot.lng,
      name: newSpot.name,
      description: newSpot.description,
      price: newSpot.price,
      createdAt: newSpot.createdAt,
      updatedAt: newSpot.updatedAt
    });
});
// Edit a spot
router.put('/:spotId', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const errors = validateSpot(req.body);

  if (errors) {
    return res.status(400).json({
      message: "Bad Request",
      errors: errors
    });
  }
    const spot = await Spot.findByPk(spotId);
    if (!spot) return res.status(404).json({ message: "Spot not found" });
    if (spot.ownerId !== req.user.id) return res.status(403).json({ message: "You do not have permission to edit this spot" });
    
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

    res.status(200).json({
      id: updatedSpot.id,
      ownerId: updatedSpot.ownerId,
      address: updatedSpot.address,
      city: updatedSpot.city,
      state: updatedSpot.state,
      country: updatedSpot.country,
      lat: updatedSpot.lat,
      lng: updatedSpot.lng,
      name: updatedSpot.name,
      description: updatedSpot.description,
      price: updatedSpot.price,
      createdAt: updatedSpot.createdAt,
      updatedAt: updatedSpot.updatedAt
    });
});
// Delete a spot
router.delete('/:id', requireAuth, async (req, res) => {
      const spot = await Spot.findByPk(req.params.id);

      if (!spot) return res.status(404).json({ message: "Spot couldn't be found"});
      
      if (spot.ownerId !== req.user.id) return res.status(403).json({ message: "You do not have permission to delete this spot" });
      
      await spot.destroy();
      
      res.status(200).json({ message: "Successfully deleted"});
});
// Add image to spot based on spotId (in progress)
// router.get('/:id', async (req, res) => {
//       const spotId = req.params.id;
//       const spotDetails = await Spot.findByPk(spotId);

//       if (!spotDetails) {
//           return res.status(404).json({
//             "message": "Spot couldn't be found"});
//       }
//       res.status(200).json(spotDetails);
// });
// Get spots by current user 
router.get('/current', requireAuth, async (req, res) => {
    const spots = await Spot.findAll({
      where: { ownerId: req.user.id },
      attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'avgRating', 'previewImage']
    });
  res.status(200).json({ Spots: spots });
});
// Create a review for a spot
router.post('/:id/reviews', requireAuth, async (req, res) => {
  const spotId = req.params.id;
  const { review, stars } = req.body;
  const userId = req.user.id;

  const errors = validateReviews(req.body);
  
  if (errors) {
    return res.status(400).json({
      message: "Bad Request",
      errors: errors
    });
  }
  const spot = await Spot.findByPk(spotId);
  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });
  

  const existingReview = await Review.findOne({ where: { userId, spotId } });
  if (existingReview) return res.status(403).json({ message: 'User already has a review for this spot' });
  
  
  const newReview = await Review.create({ userId, spotId, review, stars });
  
  
  res.status(201).json({
    id: newReview.id,
    userId: newReview.userId,
    spotId: newReview.spotId,
    review: newReview.review,
    stars: newReview.stars,
    createdAt: newReview.createdAt,
    updatedAt: newReview.updatedAt
  });
});
// Create a booking for a spot
router.post('/:id/bookings', requireAuth, async (req, res) => {
  const spotId = req.params.id;
  const {startDate, endDate} = req.body;
  const userId = req.user.id;
  
  if (startDate > endDate) {
    return res.status(400).json({
      message: "Bad Request",
      errors: { endDate: 'enddate cannot be on or before startDate'}
    });
  }
  const spot = await Spot.findByPk(spotId);
  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });
  

  const existingBooking = await Booking.findOne({ where: { userId, spotId } });
  if (existingBooking) return res.status(403).json({ message: 'User already has a booking for this spot' });
  
  const conflictingBooking = await Booking.findOne({
    where: {
      spotId,
      [Op.or]: [
        {
          startDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        {
          endDate: {
            [Op.between]: [startDate, endDate],
          },
        },
      ],
    },
  });

  if (conflictingBooking) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking"
      }
    });
  }
  const newBooking = await Booking.create({ userId, spotId, startDate, endDate });
  
  
  res.status(200).json({
    id: newBooking.id,
    userId: newBooking.userId,
    spotId: parseInt(newBooking.spotId),
    startDate: newBooking.startDate,
    endDate: newBooking.endDate,
    createdAt: newBooking.createdAt,
    updatedAt: newBooking.updatedAt
  });
});
module.exports = router;