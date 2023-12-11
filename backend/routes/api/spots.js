const express = require('express');
const { Review, User, Spot, ReviewImage, Booking, SpotImage } = require('../../db/models'); 
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Op } = require("sequelize");
const getNumReviews = async (body) => {
  return await Review.count({
    where: { spotId: body }
  });
}
const calculateAvgStarRating = async (body) => {
  const starsRatings = await Review.findAll({
    where: { spotId: body },
    attributes: ['stars'],
  });
  console.log(starsRatings)
  if (starsRatings.length === 0) {
    return 0;
  }

  const sum = starsRatings.reduce((acc, curr) => {
    return acc + curr.stars; 
  }, 0);

  const avg = sum / starsRatings.length;
  return avg;
}


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
  let { 
    minLat, maxLat, page, size, maxLng, minLng, minPrice, maxPrice
  } = req.query;
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
      attributes: [
        'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 
        'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt', 
        'avgRating', 'previewImage'
      ],  
      limit: size,
      offset: (page - 1) * size
    });
    const convertedSpotted = await Promise.all(spotted.map(async (spot) => {
      const avgRating = await calculateAvgStarRating(spot.id);
  
      return {
        ...spot.get({ plain: true }),
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.lng),
        price: parseFloat(spot.price),
        avgRating: avgRating
      };
    }));
  return res.status(200).json({
    Spots: convertedSpotted,
    page,
    size
  });
  } else {
    const spots = await Spot.findAll({
      attributes: [
        'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 
        'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt', 
        'avgRating', 'previewImage'
      ]});
      const convertedSpots = await Promise.all(spots.map(async (spot) => {
        const avgRating = await calculateAvgStarRating(spot.id);
    
        return {
          ...spot.get({ plain: true }),
          lat: parseFloat(spot.lat),
          lng: parseFloat(spot.lng),
          price: parseFloat(spot.price),
          avgRating: avgRating
        };
      }));
      res.status(200).json({ 
        Spots: convertedSpots,
        page,
        size
      });
  }
});
// Create a Spot
router.post('/', requireAuth, async (req, res) => {
  const { 
    address, city, state, country, lat, lng, name, description, price 
  } = req.body;
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
// Edit a Spot
router.put('/:spotId', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { 
    address, city, state, country, lat, lng, name, description, price 
  } = req.body;
  const errors = validateSpot(req.body);

  if (errors) {
    return res.status(400).json({
      message: "Bad Request",
      errors: errors
    });
  }
    const spot = await Spot.findByPk(spotId);
    if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });
    if (spot.ownerId !== req.user.id) return res.status(403).json({ 
      message: "You do not have permission to edit this spot" 
    });
    
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
// Delete a Spot
router.delete('/:id', requireAuth, async (req, res) => {
      const spot = await Spot.findByPk(req.params.id);

      if (!spot) return res.status(404).json({ 
        message: "Spot couldn't be found"
      });
      
      if (spot.ownerId !== req.user.id) return res.status(403).json({ 
        message: "You do not have permission to delete this spot" 
      });
      
      await spot.destroy();
      
      res.status(200).json({ message: "Successfully deleted"});
});
// Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
    const spots = await Spot.findAll({
      where: { ownerId: req.user.id },
      attributes: 
      ['id', 'ownerId', 'address', 'city', 'state', 'country', 
      'lat', 'lng', 'name', 'description', 'price', 'avgRating', 
      'previewImage']
    });
  res.status(200).json({ Spots: spots });
});
// Create a Review for a Spot based on the Spot's id
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
  if (existingReview) return res.status(500).json({ 
    message: "User already has a review for this spot" 
  });
  
  
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
// Create a Booking from a Spot based on the Spot's id
router.post('/:id/bookings', requireAuth, async (req, res) => {
  const spotId = req.params.id;
  const {startDate, endDate} = req.body;
  const userId = req.user.id;
  
  if (startDate >= endDate) {
    return res.status(400).json({
      message: "Bad Request",
      errors: { endDate: "endDate cannot be on or before startDate"}
    });
  }
  const spot = await Spot.findByPk(spotId);

  if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });
  
  if (spot.ownerId === userId) return res.status(403).json({ 
    message: "You cannot create a booking on a spot you own" 
  });
  
  const validateBooking = async () => {
    let errors = {};
      const badStartDate = await Booking.findOne({
        where: {
          spotId,
          [Op.or]: [
            { 
              [Op.and]: [
                { startDate: { [Op.lte]: startDate } },
                { endDate: { [Op.gte]: endDate } }
              ]
            },
            {
              [Op.and]: [
                { endDate: { [Op.gte]: startDate } },
                { endDate: { [Op.lte]: endDate } }
              ]
            }
          ]
        }
      });
      
      if (badStartDate) {
        errors.startDate = "Start date conflicts with an existing booking";
      }
    const badEndDate = await Booking.findOne({
      where: {
        spotId,
        [Op.or]: [
          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
              { endDate: { [Op.gte]: endDate } }
            ]
          },
          {
            [Op.and]: [
              { startDate: { [Op.gte]: startDate } },
              { startDate: { [Op.lte]: endDate } }
            ]
          }
        ]
      }
    });
  
    if (badEndDate) {
      errors.endDate = "End date conflicts with an existing booking";
    }
      return Object.keys(errors).length === 0 ? null : errors;
  };
    let invalidBooking = await validateBooking(req.body);

  if (invalidBooking) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: invalidBooking
    });
  }
  const newBooking = await Booking.create({ 
    userId, spotId, startDate, endDate 
  });
  
  
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
// Get all Reviews by a Spot's id
router.get('/:id/reviews', async (req, res) => {
  const spotId = req.params.id;

  const reviews = await Review.findAll({
    where: { spotId: spotId },
    include: [
        {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        }
    ]
  });
  
  const reviewIds = reviews.map(review => review.id)

  const reviewImages = await ReviewImage.findAll({
    where: {reviewId: reviewIds},
    attributes: ['id', 'reviewId', 'url']
  })
  const reviewImageMap = reviewImages.reduce((map, image) => {
    if (!map[image.reviewId]) map[image.reviewId] = [];
    map[image.reviewId].push({
        id: image.id,
        url: image.url
    });
    return map;
  }, {});

  reviews.forEach(review => {
    review.dataValues.ReviewImages = reviewImageMap[review.id] || 'No Images';
  });

  if(reviews.length === 0) return res.status(404).json({ message: "Spot couldn't be found" })
  
  res.status(200).json({ Reviews: reviews });
})    
// Add an Image to a Spot based on the Spot's id
router.post('/:id/images', requireAuth, async (req, res) => { 
  const spotId = req.params.id;
  const { url, preview } = req.body;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
  }
  if(spot.ownerId !== req.user.id) {
    return res.status(403).json({ 
      message: "You do not have permission to add an image to this spot" 
    });
  } 
  
  const newImage = await SpotImage.create({
      spotId: spotId,
      url: url,
      preview: preview 
  });

  res.status(200).json({
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview
  });
})
// Get details of a Spot from an id
router.get('/:id', async (req, res) => { 
  const spotId = req.params.id;
  const spot = await Spot.findByPk(spotId, {
    include: [
      {
        model: SpotImage,
        attributes: ['id', 'url', 'preview']
      },
      {
        model: User,
        as: 'Owner',
        attributes: ['id', 'firstName', 'lastName']
      }
    ]
  })
  
  if(!spot) return res.status(404).json({message: "Spot couldn't be found" })

  const avgStarRating = await calculateAvgStarRating(spotId);
  const numReviews = await getNumReviews(spotId)

  const response = {
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    numReviews: numReviews,
    avgStarRating: avgStarRating, 
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
    SpotImages: spot.SpotImages, 
    Owner: spot.Owner
};

res.status(200).json(response);
})
// Get all Bookings for a Spot based on the Spot's id 
router.get('/:id/bookings', requireAuth, async (req, res) => { 
  const spotId = req.params.id;
  const userId = req.user.id;
  
  const spot = await Spot.findByPk(spotId)
  
  if(!spot) return res.status(404).json({message: "Spot couldn't be found"})
  
  if(userId === spot.ownerId){
    const userBookings = await User.findByPk(userId,{
      attributes: ['id', "firstName", 'lastName'],
      include: [
        {
          model: Booking,
          attributes: ['id', 'spotId', 'userId', 'startDate', 
          'endDate', 'createdAt', 'updatedAt']
        }
      ]
    })
    const Bookings = userBookings.Bookings.map(booking => ({
      User: {
        id: userBookings.id,
        firstName: userBookings.firstName,
        lastName: userBookings.lastName
      },
      ...booking.dataValues
    }));
    res.status(200).json({Bookings})
  } else {
    const Bookings = await Booking.findAll({
      where: {spotId: spotId},
      attributes: ['spotId', "startDate", 'endDate']
    })
    res.status(200).json({Bookings})
  }
})
// Delete a Spot Image
router.delete('/:id/images/:id', requireAuth, async (req, res) => { 
    const {spotId, imageId} = req.params.id;
    const spotImage = await Spot.findByPk(imageId);

      if (!spotImage) return res.status(404).json({ 
        message: "Spot Image couldn't be found"
      });
      const spot = await Spot.findByPk(spotId);
      if (spot.ownerId !== req.user.id) return res.status(403).json({ 
        message: "You do not have permission to delete this spot" 
      });
      
      await spotImage.destroy();
      
      res.status(200).json({ message: "Successfully deleted"});
})

module.exports = router;