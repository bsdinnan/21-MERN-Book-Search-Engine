const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args) => {
      try {
        const user = await User.findById(args.userId);

        if (!user) {
          throw new Error("User not found");
        }

        return user;
      } catch (error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
      }
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, { user, bookInput }) => {
      if (!user || !user._id || !bookInput || !bookInput.bookId) {
        throw new Error("Invalid input. Please provide user._id and bookInput with bookId.");
      }

      const existingUser = await User.findById(user._id);
      if (!existingUser) {
        throw new Error("User not found");
      }

      const newBook = { ...bookInput };

      existingUser.savedBooks.push(newBook);

      existingUser.bookCount = existingUser.savedBooks.length;

      const updatedUser = await existingUser.save();

      return updatedUser;
    },
    removeBook: async (parent, args) => {
      return User.savedBooks.findOneAndDelete({ bookId: args.bookId });
    },
  },
};

module.exports = resolvers;
