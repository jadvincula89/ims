// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCSRF } from './fetchBaseQuery';
// import { store } from '../store';
import { setToken } from '../store/slice/auth';

const AUTH_TAGS = {
  LOGIN: 'LOGIN'
};

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithCSRF,
  tagTypes: [AUTH_TAGS.LOGIN],
  endpoints: (builder) => ({
    login: builder.mutation({
      query(credentials) {
        return {
          url: '/login',
          method: 'POST',
          body: credentials
        };
      }
    }),
    getconfig: builder.query({
      query(params) {
        return {
          url: `/configurations`,
          method: 'GET',
          params: { per_page: 1000, ...(params || {}) }
        };
      },
      transformResponse: (response) => {
        const data = response?.data || [];
        const result_data = {};

        data.map((d) => {
          result_data[d.name] = d.value;
          return d;
        });

        return result_data;
      }
    }),
    forgotPassword: builder.mutation({
      query(credentials) {
        return {
          url: 'forgot-password',
          method: 'POST',
          body: credentials
        };
      }
    }),
    resetPassword: builder.mutation({
      query(credentials) {
        return {
          url: 'reset-password',
          method: 'POST',
          body: credentials
        };
      }
    })
  })
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useGetconfigQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = authApi;
