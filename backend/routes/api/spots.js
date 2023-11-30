const express = require('express');
const { Spot } = require('../../db/models'); 
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');



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

router.get('/', async (req, res, next) => {
    console.log('hello');
  try {
    const Spots = await Spot.findAll({
      attributes: [
        'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name',
        'description', 'price', 'createdAt', 'updatedAt', 'avgRating', 'previewImage',
      ]
    });
    res.json({ Spots });
  } catch (err) {
    console.error(err);
    next(err); 
  }
});
router.post('/', requireAuth, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const errors = validateSpot(req.body);
  if (errors) {
    return res.status(400).json({
      message: "Bad Request",
      errors: errors
    });
  }

  try {
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
  } catch (err) {
    next(err);
  }
});
router.put('/:spotId', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const errors = validateSpot(req.body);

  if (errors) {
    return res.status(400).json({
      message: "Bad Request",
      errors: errors
    });
  }

  try {
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }
    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: "You do not have permission to edit this spot" });
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
    res.json({
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
  } 
  catch (err) {
    next(err);
  }
});
router.delete('/:id', requireAuth, async (req, res) => {
      const spotId = req.params.id;
      const spot = await Spot.findByPk(spotId);
  try{
      if (!spot) {
          return res.status(404).json({
            message: "Spot couldn't be found"
          });
      }
      if (spot.ownerId !== req.user.id) {
        return res.status(403).json({ message: "You do not have permission to delete this spot" });
      }
      await spot.destroy();
      res.status(200).json({
        message: "Successfully deleted"
      });
    } catch(err) {
      next(err);
    }
});
router.get('/:id', async (req, res) => {
  try {
      const spotId = req.params.id;
      const spotDetails = await Spot.findByPk(spotId);

      if (!spotDetails) {
          return res.status(404).json({
            "message": "Spot couldn't be found"
          });
      }
      res.status(200).json(spotDetails);
  } catch (err) {
      next(err);
  }
});


module.exports = router;