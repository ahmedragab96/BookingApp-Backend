const express = require('express');
const bodyParser = require('body-parser');
const graphHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graghql/schema/index');
const graphQlResolvers = require('./graghql/resolvers/index');
const {
  verifyToken,
} = require('./middleware/verifyUser');

const app = express();

app.use(bodyParser.json());

app.use(verifyToken);

app.use('/graphql', graphHttp({
  schema: graphQlSchema,
  rootValue: graphQlResolvers,
  graphiql: true,
}));

// configure database connection to atlas mongo db
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