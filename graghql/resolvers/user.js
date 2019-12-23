
const bcrypt = require('bcryptjs');

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
      const result = await user.save();
      return {
        ...result._doc,
      };
    } catch (error) {
      throw error;
    }
  };

module.exports = {
  createUser,
};
