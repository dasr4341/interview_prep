import { USER_DETAILS } from '@/graphql/getUserDetails.query';
import { client } from '@/lib/apolloClient';
import { ApolloError } from '@apollo/client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface IAppState {
  value: number;
  user: {
    phoneNumber: string | null;
    id: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    location: string | null;
  } | null;
  loading: boolean;
  error?: unknown;
  modal: {
    login: boolean;
  };
}

const initialState: IAppState = {
  value: 0,
  user: {
    phoneNumber: null,
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    location: null,
  },
  modal: {
    login: false,
  },
  loading: false,
};

export const getCurrentUserDetails = createAsyncThunk(
  'getCurrentUserDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await client.query({
        query: USER_DETAILS,
      });
      return response.data.getUserDetails;
    } catch (error: unknown) {
      if (error instanceof ApolloError) {
        return rejectWithValue(error.message); // Apollo-specific error handling
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message); // General error handling
      }
      return rejectWithValue('An unknown error occurred'); // Fallback for unexpected error types
    }
  }
);

export const appSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoginModel: (state, { payload }: { payload: boolean }) => {
      state.modal.login = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrentUserDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCurrentUserDetails.fulfilled, (state, action) => {
      state.loading = false;
      const { email, firstName, lastName, id, phoneNumber, location } =
        action.payload;
      state.user = {
        email: email || null,
        firstName: firstName || null,
        lastName: lastName || null,
        phoneNumber: phoneNumber || null,
        id,
        location: location || null,
      };
    });
    builder.addCase(getCurrentUserDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const appSliceActions = appSlice.actions;

export default appSlice.reducer;
