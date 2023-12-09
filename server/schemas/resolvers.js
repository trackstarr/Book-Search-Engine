const { User } = require('../models');
// import sign token function from auth
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    async me(parent, args, context) {
      const foundUser = await User.findOne({
      _id: context.user._id, 
      });
  
      if (!foundUser) {
        // return throwError('Cannot find a user with this id!');
        throw AuthenticationError;
      }
  
      return (foundUser);
    }
  
  },
  Mutation: {
    async createUser(parent, args, context) {
    const user = await User.create(args);

    if (!user) {
      throw AuthenticationError;
    }
    const token = signToken(user);
    return ({ token, user });
  },
  // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
  // {body} is destructured req.body
  async login(parent, args, context) {
  
    const user = await User.findOne({ $or: [{ username: args.username }, { email: args.email }] });
    console.log("what", user);
    if (!user) {
      throw AuthenticationError;
    }

    const correctPw = await user.isCorrectPassword(args.password);
    console.log("correctPw", correctPw);

    if (!correctPw) {
      throw AuthenticationError;
    }
    const token = signToken(user);
    return ({ token, user });
  },
  // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
  // user comes from `req.user` created in the auth middleware function
  async saveBook(parent, args, context) {
    try {
      console.log(context.user);
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: args } },
        { new: true, runValidators: true }
      );
      return (updatedUser);
    } catch (err) {
      console.log(err);
      throw AuthenticationError;
    }
  },
  // remove a book from `savedBooks`
  async deleteBook(parent, args, context) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: context.user._id },
      { $pull: { savedBooks: { bookId: args.bookId } } },
      { new: true }
    );
    if (!updatedUser) {
      throw AuthenticationError;
    }
    return (updatedUser);
  },
  },
};

module.exports = resolvers;
