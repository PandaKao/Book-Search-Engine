import { gql } from '@apollo/client';

export const ADD_USER = gql`
    mutation addUser($input: UserInput!) {
        addUser(input: $input) {
            token
            user {
                _id
                username
                email
            }
        }
    }
`;

export const LOGIN_USER = gql`
    mutation loginUser($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
        token
        user {
            _id
             username
            }
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation saveBook($input: BookInput!) {
        saveBook(input: $input) {
            _id
            username
            savedBooks {
                bookId
                title
                authors
                description
                image
                link
            }
        }
    }
`;