const express = require('express');
const bodyParser = require('body-parser');
const graphHttp = require('express-graphql');
const {
  buildSchema,
} = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Models
const Event = require('./models/event');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

const getUserEvents = async (eventsIds) => {
  const events = await Event.find({
    _id: {$in: eventsIds}
  })

  return events;
}

app.use('/graphql', graphHttp({
  schema: buildSchema(`
    type Event {
      _id: ID
      title: String!
      description: String!
      price: Float!
      date: String!
      creator: User!
    }

    type User {
      _id: ID
      email: String!
      password: String
      createdEvents: [Event!]!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    // retrieve events 
    events: async () => {

      // get events
      const events  = await Event.find();

      // map events to get creator data
      return events.map( async (event) => {
        let user = await User.findById(event.creator);

        // get user events
        const userEvents = await getUserEvents(user.createdEvents);
        console.log('user events ===>', userEvents);
        user.createdEvents = userEvents;
        event.creator = user;
        return event;
      });
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
        return user
          .save()
          .then(result => {
            return result;
          }).catch(error => {
            console.log(error);
          });
      } catch (error) {
        throw error;
      }
    }
  },
  graphiql: true,
}));

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@bookingapp-1puwi.mongodb.net/${
      process.env.MONGO_DB
    }?retryWrites=true&w=majority`
  ).then(() => {
    app.listen(3000); 
  }).catch(err => {
    console.log(err);
  });