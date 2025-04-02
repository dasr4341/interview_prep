import { gql } from '@apollo/client';

export const getEmailShortCodes = gql`
  query EmailShortCodes {
    pretaaGetShortcodes {
      id
      shortcode
      icon
      label
    }
  }
`;
