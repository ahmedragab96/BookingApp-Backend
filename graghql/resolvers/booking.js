const Booking = require('../../models/booking');
const Event = require('../../models/event');
const {
  flattenEvent,
  getUser,
  getSingleEvent,
} = require('./resolversHelpers');


//get bookings data
const bookings = async () => {
  try {
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

const bookEvent = async (args) => {
  try {
    const {
      eventId,
    } = args;

    // fetching event
    const event = await Event.findOne({
      _id: eventId
    });

    const booking = new Booking({
      event,
      user: '5dfce38d4924a4249e412aed',
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

const cancelBooking = async (args) => {
  try {
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