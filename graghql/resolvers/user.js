
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// models
const User = require('../../models/user');

  // create user
  const createUser = async (args) => {

    try {
      const {
        email,
        password,
      } = args.userInput;
      // check for user exists
      const existedUser = await User.findOne({
        email,
      });
  
      if (existedUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        email,
        password: hashedPassword,
      });

      // save user in database
      const result = await user.save();
      return {
        ...result._doc,
      };
    } catch (error) {
      throw error;
    }
  };

const login = async (args) => {
  try {
    const {
      email,
      password,
    } = args;

    const user = await User.findOne({email});
    if (!user) {
      throw new Error('user doesn\'t exist');
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Wrong Password');
    }
    const token = jwt.sign({
      userId: user.id,
      email: user.email
    },
    process.env.JWTSECRETKEY,{
      expiresIn: '1h'
    });

    return {
      userId: user.id,
      token,
      ExpirationPeriod: 1,
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  login,
};
