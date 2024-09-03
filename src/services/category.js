// Need to use the React-specific entry point to allow generating React hooks
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCSRF } from './fetchBaseQuery';

const CATEGORY_TAGS = {
  CATEGORY: 'CATEGORY',
  CATEGORY_LIST: 'CATEGORY_LIST',
  CATEGORY_DETAILS: 'CATEGORY_DETAILS'
};

// Define a service using a base URL and expected endpoints
export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: baseQueryWithCSRF,
  endpoints: (builder) => ({
    category: builder.query({
      providesTags: [CATEGORY_TAGS.CATEGORY_LIST],
      query(params) {
        return {
          url: '/categories',
          method: 'GET',
          params
        };
      }
    }),

    categoryCreate: builder.mutation({
      providesTags: [CATEGORY_TAGS.CATEGORY],
      query(params) {
        return {
          url: '/category',
          method: 'POST',
          body: params
        };
      },
      invalidatesTags: [CATEGORY_TAGS.CATEGORY_LIST]
    }),
    categoryUpdate: builder.mutation({
      providesTags: [CATEGORY_TAGS.CATEGORY],
      query(params) {
        return {
          url: `/category/${params.id}`,
          method: 'PUT',
          body: params
        };
      },
      invalidatesTags: [CATEGORY_TAGS.CATEGORY_LIST]
    }),
    categoryDelete: builder.mutation({
      providesTags: [CATEGORY_TAGS.CATEGORY],
      query(params) {
        return {
          url: `category/${params.id}`,
          method: 'DELETE',
          body: params
        };
      },
      invalidatesTags: [CATEGORY_TAGS.CATEGORY_LIST]
    })
  })
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useCategoryQuery,
  useLazyCategoryQuery,
  useCategoryCreateMutation,
  useCategoryUpdateMutation,
  useCategoryDeleteMutation
} = categoryApi;
