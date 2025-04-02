import { gql } from '@apollo/client';

export const setThresholdMutation = gql`
  mutation SetThresholds($pretaaSetThresholdsValues2: [PretaaUseCaseVariablesInputInnerArgs!]) {
    pretaaSetThresholds(values: $pretaaSetThresholdsValues2)
  }
`;
