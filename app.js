const express    = require('express');
const bodyParser = require('body-parser');
const graphHttp  = require('express-graphql');
const mongoose   = require('mongoose');
const cors       = require('cors');
const dotenv     = require('dotenv').config();

const graphQlSchema    = require('./graghql/schema/index');
const graphQlResolvers = require('./graghql/resolvers/index');
const {
  verifyToken,
} = require('./middleware/verifyUser');
const sendEmail = require('./helperFunctions/sendEmail');

const app = express();

app.use(cors());

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
    app.listen(8080);
    sendEmail(
      'ahmed.r.shaban96@gmail.com',
      'Server is Working',
      '<b> Server is working perfectly 	&#128147; 	&#128147;</b>'
    );
  }).catch(err => {
    console.log(err);
  });