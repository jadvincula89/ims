// Need to use the React-specific entry point to allow generating React hooks
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCSRF } from './fetchBaseQuery';

const SIZE_TAGS = {
  SIZE: 'SIZE',
  SIZE_LIST: 'SIZE_LIST',
  SIZE_DETAILS: 'SIZE_DETAILS'
};

// Define a service using a base URL and expected endpoints
export const sizeApi = createApi({
  reducerPath: 'sizeApi',
  baseQuery: baseQueryWithCSRF,
  endpoints: (builder) => ({
    productSize: builder.query({
      providesTags: [SIZE_TAGS.SIZE_LIST],
      query(params) {
        return {
          url: 'sizes',
          method: 'GET',
          params
        };
      }
    }),
    sizeCreate: builder.mutation({
      providesTags: [SIZE_TAGS.SIZE],
      query(params) {
        return {
          url: 'size',
          method: 'POST',
          body: params
        };
      },
      invalidatesTags: [SIZE_TAGS.SIZE_LIST]
    }),
    sizeUpdate: builder.mutation({
      providesTags: [SIZE_TAGS.SIZE],
      query(params) {
        return {
          url: `size/${params.id}`,
          method: 'PUT',
          body: params
        };
      },
      invalidatesTags: [SIZE_TAGS.SIZE_LIST]
    }),
    sizeDelete: builder.mutation({
      providesTags: [SIZE_TAGS.SIZE],
      query(params) {
        return {
          url: `size/${params.id}`,
          method: 'DELETE',
          body: params
        };
      },
      invalidatesTags: [SIZE_TAGS.SIZE_LIST]
    })
  })
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useProductSizeQuery,
  useLazyProductSizeQuery,
  useSizeCreateMutation,
  useSizeUpdateMutation,
  useSizeDeleteMutation
} = sizeApi;
