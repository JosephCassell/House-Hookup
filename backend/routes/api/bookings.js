const express = require('express');

const { Review, User, Spot, ReviewImage, Booking } = require('../../db/models'); 
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Op } = require("sequelize");



// Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id; 
    const bookings = await Booking.findAll({
        where: { userId: userId},
        attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
        include: [{
            model: Spot,
            attributes: ['id', 'ownerId', 'address', 'city', 
            'state', 'country', 'lat', 'lng', 'name', 'price', 
            'previewImage'],
        }]
    });
    const restructuredBooking = bookings.map(booking => {
        const spot = booking.Spot.get({ plain: true });
        return {
            ...booking.get({ plain: true }),
            Spot: {
                ...spot,
                lat: parseFloat(spot.lat),
                lng: parseFloat(spot.lng),
                price: parseFloat(spot.price)
            }
        };
        // return {
        //     id: booking.id,
        //     spotId: booking.spotId,
        //     Spot: booking.Spot,
        //     userId: booking.userId,
        //     startDate: booking.startDate,
        //     endDate: booking.endDate,
        //     createdAt: booking.createdAt,
        //     updatedAt: booking.updatedAt
        // };
    });

    res.status(200).json({ Bookings: restructuredBooking });
});
// Edit a booking
router.put('/:id', requireAuth, async (req, res) => {  
    const  bookingId  = req.params.id;
    const { startDate, endDate } = req.body;
    const userId = req.user.id;
   
    const existingBooking = await Booking.findByPk(bookingId);
    
    if (!existingBooking) return res.status(404).json({ 
      message: "Booking couldn't be found" 
    });
  
    if (existingBooking.userId !== userId) return res.status(403).json({ 
      message: "You do not have permission to edit this booking" 
    });
    
    if (new Date(existingBooking.startDate) <= new Date()) {
        return res.status(403).json({
            message: "Past bookings can't be modified"
        });
      }
      const currentDate = new Date();
      if (new Date(startDate) < currentDate) {
          return res.status(400).json({
              message: "Cannot set booking to past dates"
          });
      }
    if (startDate >= endDate) {
        return res.status(400).json({
          message: "Bad Request",
          errors: { endDate: "endDate cannot be on or before startDate"}
        });
      }
    const validateBooking = async (body) => {
        let problems = {};
        const badStartDate = await Booking.findOne({
            where: {
                id: { [Op.ne]: bookingId },
                userId,
                [Op.or]: [
                    { 
                        [Op.and]: [
                            { startDate: { [Op.lte]: body.startDate } },
                            { endDate: { [Op.gte]:  body.endDate } }
                        ]
                    },
                    {
                        [Op.and]: [
                            { endDate: { [Op.gte]:  body.startDate } },
                            { endDate: { [Op.lte]:  body.endDate } }
                        ]
                    }
                ]
            }
        });
        
        if (badStartDate) {
            problems.startDate = "Start date conflicts with an existing booking";
        }
        const badEndDate = await Booking.findOne({
            where: {
                id: { [Op.ne]: bookingId },
                userId,
                [Op.or]: [
                    {
                        [Op.and]: [
                            { startDate: { [Op.lte]:  body.startDate } },
                            { endDate: { [Op.gte]:  body.endDate } }
                        ]
                    },
                    {
                        [Op.and]: [
                            { startDate: { [Op.gte]:  body.startDate } },
                            { startDate: { [Op.lte]:  body.endDate } }
                        ]
                    }
                ]
            }
        });
        
        if (badEndDate) {
            problems.endDate = "End date conflicts with an existing booking";
        }
        return Object.keys(problems).length === 0 ? null : problems;
    };
    const errors = await validateBooking(req.body);
    if (errors) {
        return res.status(403).json({
            message: "Bad Request",
            errors: errors
        });
    }
   
  

  const updatedBooking = await existingBooking.update({
    startDate,
    endDate
  })

  res.status(200).json({
      id: updatedBooking.id,
      userId: updatedBooking.userId,
      spotId: updatedBooking.spotId,
      startDate: updatedBooking.startDate,
      endDate: updatedBooking.endDate,
      createdAt: updatedBooking.createdAt,
      updatedAt: updatedBooking.updatedAt
  });
});
// Delete a Booking
router.delete('/:id', requireAuth, async (req, res) => {
    const booking = await Booking.findByPk(req.params.id);
    let currentDate = new Date()
    if (!booking) return res.status(404).json({ 
      message: "Booking couldn't be found"
    });
    
    if (booking.userId !== req.user.id) return res.status(403).json({ 
      message: "You do not have permission to delete this booking" 
    });
    console.log(currentDate)
    if (currentDate <= booking.endDate && currentDate >= booking.startDate) {
        return res.status(403).json({
            message: "Bookings that have been started can't be deleted"
        });
    }
    await booking.destroy();
    
    res.status(200).json({ message: "Successfully deleted"});
});



module.exports = router;