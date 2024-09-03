// Need to use the React-specific entry point to allow generating React hooks
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCSRF } from './fetchBaseQuery';

const TRANSACTION_TAGS = {
  LIST: 'TRANSACTION/LIST'
};

// Define a service using a base URL and expected endpoints
export const transactionApi = createApi({
  reducerPath: 'transactionApi',
  baseQuery: baseQueryWithCSRF,
  tagTypes: [TRANSACTION_TAGS.LIST],
  endpoints: (builder) => ({
    list: builder.query({
      providesTags: [TRANSACTION_TAGS.LIST],
      query(params) {
        return {
          url: 'transactions',
          method: 'GET',
          params
        };
      }
    })
  })
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useListQuery, useLazyListQuery } = transactionApi;
