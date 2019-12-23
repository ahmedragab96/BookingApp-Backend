const User = require('../../models/user');
const Booking = require('../../models/booking');
const Event = require('../../models/event');

const getUserEvents = async (eventsIds) => {

  // retrieve user events
  const events = await Event.find({
    _id: { $in: eventsIds }
  });

  return events.map(async (event) => {
    return flattenEvent(event);
  });
};

const getSingleEvent = async (eventId) => {
  const event = await Event.findById(eventId);
  return flattenEvent(event);
}

const getUser = async (id) => {

  const user = await User.findById(id);
  return {
    ...user._doc,
    createdEvents: getUserEvents.bind(this, user._doc.createdEvents)
  }
};

const flattenEvent = (event) => {
  return ({
    ...event._doc,
    creator: getUser.bind(this, event._doc.creator),
    date: new Date(event._doc.date).toISOString(),
  });
}
module.exports = {
  getUserEvents,
  flattenEvent,
  getUser,
  getSingleEvent,
};