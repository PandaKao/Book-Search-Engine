import { User } from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';

interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    savedBooks: Book[];
    bookCount?: number;
}

interface Book {
    bookId: string;
    title: string;
    authors: string[];
    description: string;
    image?: string;
    link?: string;
}

interface SignupArgs {
    input: {
        username: string;
        email: string;
        password: string;
    }
}

interface SearchBooksArgs {
    searchTerm: string;
}

interface SaveBookArgs {
    bookId: string;
}

interface RemoveBookArgs {
    bookId: string;
}

interface Context {
    user?: User;
}

const resolvers = {
    Query: {
        me: async (_parent: unknown, _args: unknown, context: Context): Promise<User | null> => {
            if (context.user) {
                return await User.findOne({ _id: context.user._id }).populate('savedBooks');
            }
            throw new AuthenticationError('Not Authenticated');
        },

        // searchBooks: async (_parent: unknown, { searchTerm }: SearchBooksArgs): Promise<string[]> => {

        // },
    },

    Mutation: {
        signup: async (_parent: unknown, { input }: SignupArgs): Promise<{ token: string; user: User }> => {
            const user = await User.create({ ...input });
            const token = signToken(user.username, user.email, user._id);

            return { token, user };
        },

        login: async (_parent: unknown, { email, password }: { email: string; password: string }): Promise<{ token: string; user: User }> => {
            const user = await User.findOne({ email });

            if (!user) {
                throw AuthenticationError;
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Not Authenticated');
            }

            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        }
    }
}

export default resolvers;