const express = require('express');
const bodyParser = require('body-parser');
const graphHttp = require('express-graphql');
const {
  buildSchema,
} = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphHttp({
  schema: buildSchema(`
    type Event {
      _id: ID
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return Event
        .find()
        .then(events => {
          return events.map(event => {
            return {...event._doc};
          })
        })
        .catch(error => {
          console.log(error);
        });
    },
    createEvent: (args) => {
      const {
        title,
        description,
        price
      } = args.eventInput

      // create event object
      const event = new Event({
        title: title,
        description: description,
        price: +price, 
        date: new Date().toString(),
      });

      // save event in database
      return event
        .save()
        .then( result =>{
          return result;
        }).catch(error => {
          console.log(error);
      });
    },
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