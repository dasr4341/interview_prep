import { GET_ADMIN_DETAILS_QUERY } from '@/graphql/getAdminDetails.query';
import { client } from '@/lib/apolloClient';
import { ApolloError } from '@apollo/client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface IAppState {
  value: number;
  user: {
    id: string | null;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  } | null;
  loading: boolean;
  error?: unknown;
}

const initialState: IAppState = {
  value: 0,
  user: {
    id: null,
    firstName: null,
    lastName: null,
    email: null,
  },
  loading: false,
};

export const getCurrentUserDetails = createAsyncThunk(
  'getCurrentUserDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await client.query({
        query: GET_ADMIN_DETAILS_QUERY,
      });
      return response.data.getAdminDetails;
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
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrentUserDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getCurrentUserDetails.fulfilled, (state, action) => {
      state.loading = false;
      const { email, firstName, lastName, id } = action.payload;
      state.user = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        id,
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
