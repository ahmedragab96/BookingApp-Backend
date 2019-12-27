const Booking = require('../../models/booking');
const Event = require('../../models/event');
const {
  flattenEvent,
  getUser,
  getSingleEvent,
} = require('./resolversHelpers');


//get bookings data
const bookings = async (req) => {
  try {
    if(!req.isAuthorized) {
			throw new Error('Not Authorized');
		}
    const bookings = await Booking.find();
    return bookings.map(booking => {
      return {
        ...booking._doc,
      }
    })
  } catch (error) {
    throw error;
  }
};

const bookEvent = async (args, req) => {
  try {
    if(!req.isAuthorized) {
			throw new Error('Not Authorized');
    }
    const {
      id,
    } = req.user;
    const {
      eventId,
    } = args;

    // fetching event
    const event = await Event.findOne({
      _id: eventId
    });

    const booking = new Booking({
      event,
      user: id,
    });

    const result = await booking.save();
    return {
      ...result._doc,
      event: getSingleEvent.bind(this, result.event),
      user: getUser.bind(this, result.user),
    }
  } catch (error) {
    throw error;
  }
};

const cancelBooking = async (args, req) => {
  try {
    if(!req.isAuthorized) {
			throw new Error('Not Authorized');
		}
    const {
      bookingId,
    } = args;

    const booking = await Booking.findById(bookingId).populate('event');

    await Booking.deleteOne({
      _id: bookingId,
    });

    return flattenEvent(booking.event);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  bookings,
  bookEvent,
  cancelBooking,
};