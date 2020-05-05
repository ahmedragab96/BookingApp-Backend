const {
  buildSchema,
} = require('graphql');

module.exports = buildSchema(`
type Event {
  _id: ID!
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

type AuthData {
  userId: ID!
  token: String!
  ExpirationPeriod: Int!
}

type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
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
  bookings: [Booking!]!
  me: User!
}

type RootMutation {
  createEvent(eventInput: EventInput): Event
  createUser(userInput: UserInput): User
  login(email: String!, password: String!): AuthData!
  bookEvent(eventId: ID!): Booking!
  cancelBooking(bookingId: ID!): Event!
}

schema {
  query: RootQuery
  mutation: RootMutation
}
`);