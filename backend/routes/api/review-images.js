const express = require('express');
const { Review, ReviewImage} = require('../../db/models'); 
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Op } = require("sequelize");

router.delete('/:id', requireAuth, async (req, res) => { 
    const imageId = req.params.id;
    const reviewImage = await ReviewImage.findByPk(imageId);

      if (!reviewImage) return res.status(404).json({ 
        message: "Review Image couldn't be found"
      });
      const review = await Review.findByPk(reviewImage.reviewId);
      if (review.userId !== req.user.id) return res.status(403).json({ 
        message: "You do not have permission to delete this review" 
      });
      
      await reviewImage.destroy();
      
      res.status(200).json({ message: "Successfully deleted"});
})



module.exports = router;