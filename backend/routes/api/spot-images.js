const express = require('express');
const { Review, User, Spot, ReviewImage, Booking, SpotImage } = require('../../db/models'); 
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Op } = require("sequelize");

router.delete('/:id', requireAuth, async (req, res) => { 
    const imageId = req.params.id;
    const spotImage = await SpotImage.findByPk(imageId);

      if (!spotImage) return res.status(404).json({ 
        message: "Spot Image couldn't be found"
      });
      const spot = await Spot.findByPk(spotImage.spotId);
      if (spot.ownerId !== req.user.id) return res.status(403).json({ 
        message: "You do not have permission to delete this spot" 
      });
      
      await spotImage.destroy();
      
      res.status(200).json({ message: "Successfully deleted"});
})

module.exports = router;