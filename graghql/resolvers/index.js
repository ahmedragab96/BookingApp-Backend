const userResolvers = require('./user');
const bookingResolvers = require('./booking');
const eventsResolvers = require('./events');

const rootResolvers = {
    ...userResolvers,
    ...bookingResolvers,
    ...eventsResolvers,
};

module.exports = rootResolvers;
