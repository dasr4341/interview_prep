import { gql } from '@apollo/client';

export const getManagersList = gql`
    mutation PretaaGetManagers($searchPhrase: String!) {
        pretaaGetManagers(searchPhrase: $searchPhrase) {
            id
            admin
            email
            name
        }
    }
`;
