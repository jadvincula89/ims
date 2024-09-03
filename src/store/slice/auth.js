import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../../services/auth';

const initialState = {
  access_token: undefined
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.access_token = action.token;
    },
    logout: (state) => {
      state.access_token = undefined;
      state.user = undefined;
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        state.access_token = action.payload.token;
        state.user = action.payload;
      }
    );
  }
});

// Action creators are generated for each case reducer function
export const { setToken, logout } = authSlice.actions;

export default authSlice.reducer;
