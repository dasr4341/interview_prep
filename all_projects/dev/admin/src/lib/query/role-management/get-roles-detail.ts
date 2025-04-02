import { gql } from '@apollo/client';

export const ViewRoleQuery = gql`
	query ViewRole($id: String!) {
		pretaaViewRole(id: $id) {
		id
		name
		capabilities
		customerId
		}
	}
`;
