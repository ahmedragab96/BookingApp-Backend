
const bcrypt = require('bcryptjs');

// models
const User = require('../../models/user');
const Event = require('../../models/event');
const Booking = require('../../models/booking');

const getUserEvents = async (eventsIds) => {

  // retrieve user events
  const events = await Event.find({
    _id: { $in: eventsIds }
  });

  return events.map(async (event) => {
    return {
        ...event._doc,
        creator: getUser.bind(this, event._doc.creator)
      }
  });
};

const getSingleEvent = async (eventId) => {
  const event = await Event.findById(eventId);
  return {
    ...event._doc,
    creator: getUser.bind(this, event._doc.creator)
  }
}

const getUser = async (id) => {

  const user = await User.findById(id);
  return {
    ...user._doc,
    createdEvents: getUserEvents.bind(this, user._doc.createdEvents)
  }
};

module.exports = {
  // retrieve events
  events: async () => {

    try {
      // get events
      const events = await Event.find();

      // map events to get creator data
      return events.map(async (event) => {
        return {
          ...event._doc,
          creator: getUser.bind(this, event._doc.creator)
        }
      }); 
    } catch (error) {
      throw error;
    }
  },

  //get bookings data
  bookings: async () => {
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
  },

  // create event
  createEvent: async (args) => {
    try {
      const {
        title,
        description,
        price
      } = args.eventInput;

      // check user creator
      const user = await User.findById("5dfce38d4924a4249e412aed");
      console.log(user);

      if (!user) {
        throw new Error('No user exists');
      }

      // create event object
      const event = new Event({
        title,
        description,
        price: +price,
        date: new Date().toString(),
        creator: '5dfce38d4924a4249e412aed',
      });

      // save event in database and in user event array
      const result = event.save();
      user.createdEvents.push(event);
      await user.save();

      return result;

    } catch (error) {
      throw error;
    }
  },

  // create user
  createUser: async (args) => {

    try {
      const {
        email,
        password,
      } = args.userInput;
      // check for user exists
      const existedUser = await User.findOne({
        email,
      });
      console.log(existedUser);
      if (existedUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        email,
        password: hashedPassword,
      });

      // save user in database
      const result = user.save();
      return {
        ...result._doc,
      };
    } catch (error) {
      throw error;
    }
  },
  bookEvent: async (args) => {
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
  },
  cancelBooking: async (args) => {
    try {
      const {
        bookingId,
      } = args;
  
      const booking =  await Booking.findById(bookingId).populate('event');

      await Booking.deleteOne({
        _id: bookingId,
      });

      return {
        ...booking.event._doc,
        creator: getUser.bind(this, booking.event._doc.creator )
      }
    } catch (error) {
      throw error;
    }
  }
};
