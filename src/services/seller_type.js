// Need to use the React-specific entry point to allow generating React hooks
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCSRF } from './fetchBaseQuery';

const SELLER_TYPE_TAGS = {
  SELLER_TYPE: 'SELLER_TYPE',
  SELLER_TYPE_LIST: 'SELLER_TYPE_LIST'
};

// Define a service using a base URL and expected endpoints
export const sellerTypeApi = createApi({
  reducerPath: 'sellerTypeApi',
  baseQuery: baseQueryWithCSRF,
  endpoints: (builder) => ({
    sellertype: builder.query({
      providesTags: [SELLER_TYPE_TAGS.SELLER_TYPE_LIST],
      query(params) {
        return {
          url: 'seller_type',
          method: 'GET',
          params
        };
      }
    }),
    create: builder.mutation({
      providesTags: [SELLER_TYPE_TAGS.SELLER_TYPE],
      query(params) {
        return {
          url: 'seller_type',
          method: 'POST',
          body: params
        };
      },
      invalidatesTags: [SELLER_TYPE_TAGS.SELLER_TYPE_LIST]
    }),
    update: builder.mutation({
      providesTags: [SELLER_TYPE_TAGS.SELLER_TYPE],
      query(params) {
        return {
          url: `seller_type/${params.id}`,
          method: 'PUT',
          body: params
        };
      },
      invalidatesTags: [SELLER_TYPE_TAGS.SELLER_TYPE_LIST]
    }),

    delete: builder.mutation({
      providesTags: [SELLER_TYPE_TAGS.SELLER_TYPE],
      query(params) {
        return {
          url: `seller_type/${params.id}`,
          method: 'DELETE',
          body: params
        };
      },
      invalidatesTags: [SELLER_TYPE_TAGS.SELLER_TYPE_LIST]
    })
  })
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useSellertypeQuery,
  useDeleteMutation,
  useCreateMutation,
  useUpdateMutation
} = sellerTypeApi;
