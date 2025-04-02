import { gql } from "@apollo/client";

export const SIGN_UP_USER = gql`mutation ($signUpData: signUpUserInput!){
	user:signUpUser(signUpUserData: $signUpData){
		name
  }
}`;