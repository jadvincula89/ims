import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { store } from '../store';
import { logout } from '../store/slice/auth';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
  prepareHeaders(headers, { getState }) {
    const token = getState().auth.access_token;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (!headers.get('Accept')) {
      headers.set('Accept', 'application/json');
    }

    return headers;
  }
});

export const baseQueryWithCSRF = async (args, api, extraOptions) => {
  const result = await baseQuery({ ...args }, api, extraOptions);

  if (result.error?.status === 401) {
    store.dispatch(logout());
  }

  return result;
};
