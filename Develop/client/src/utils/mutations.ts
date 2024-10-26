import { gql } from '@apollo/client';

export const ADD_USER = gql`
    mutation signup($input: UserInput!) {
        signup(input: $input) {
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
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
        token
        user {
            _id
             username
            }
        }
    }
`;