/* eslint-disable jest/no-disabled-tests */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginScreen } from './LoginScreen';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { MockedProvider } from '@apollo/client/testing';
import { checkSsoUser } from 'lib/query/user/check-sso-user';

test.skip('Login Screen Fields', async () => {
  const EMAIL = 'test@test.com';

  const mocks: any = [
    {
      request: {
        query: checkSsoUser,
        variables: {
          email: EMAIL,
        },
      },
      result: {
        data: {
          pretaaGetSSOUser: {
            customerName: '',
            clientId: null,
            domain: null,
          },
        },
      },
    },
  ]; // We'll fill this in next

  const history = createMemoryHistory();

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Router history={history}>
        <Route path="/" element={LoginScreen} />
      </Router>
    </MockedProvider>
  );
  const email = screen.getByTestId('email');
  expect(email).toBeInTheDocument();

  fireEvent.change(email, { target: { value: 'test@test.com' } });
  expect(email).toHaveValue('test@test.com');

  // Mock Testing for graphql now need check required
  const continueBtn = screen.getByTestId('continue-btn');
  continueBtn.click();

  // Todo: Unable to catch password field
  waitFor(() => {
    const password = screen.getByTestId('password');
    expect(password).toBeVisible();
  });
  
});
