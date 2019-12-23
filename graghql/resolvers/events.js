const Event = require('../../models/event');
const {
	flattenEvent,
} = require('./resolversHelpers');
const User = require('../../models/user');

// retrieve events
const events = async () => {

	try {
		// get events
		const events = await Event.find();

		// map events to get creator data
		return events.map(async (event) => {
			return flattenEvent(event);
		});
	} catch (error) {
		throw error;
	}
};

// create event
const createEvent =  async (args) => {
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
		const result = await event.save();
		user.createdEvents.push(event);
		await user.save();

		return flattenEvent(result);

	} catch (error) {
		throw error;
	}
};

module.exports = {
	events,
	createEvent,
};