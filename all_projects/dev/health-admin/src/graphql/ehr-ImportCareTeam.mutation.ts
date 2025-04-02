import { gql } from '@apollo/client';

export const ehrImportCareTeamMutation = gql`mutation EHRImportCareTeam($file: Upload!, $updateExistingUsers: Boolean) {
  pretaaHealthEHRImportCareTeam(file: $file, updateExistingUsers: $updateExistingUsers)
}`;