// Need to use the React-specific entry point to allow generating React hooks
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCSRF } from './fetchBaseQuery';

const PRODUCT_TYPE_TAGS = {
  LIST: 'PRODUCT_TYPE/LIST',
  CREATE: 'PRODUCT_TYPE/CREATE',
  UPDATE: 'PRODUCT_TYPE/UPDATE',
  DELETE: 'PRODUCT_TYPE/DELETE',
  SEARCH: 'PRODUCT_TYPE/SEARCH'
};

// Define a service using a base URL and expected endpoints
export const productTypeApi = createApi({
  reducerPath: 'productTypeApi',
  baseQuery: baseQueryWithCSRF,
  tagTypes: [
    PRODUCT_TYPE_TAGS.LIST,
    PRODUCT_TYPE_TAGS.CREATE,
    PRODUCT_TYPE_TAGS.UPDATE,
    PRODUCT_TYPE_TAGS.DELETE,
    PRODUCT_TYPE_TAGS.SEARCH
  ],
  endpoints: (builder) => ({
    list: builder.query({
      providesTags: [PRODUCT_TYPE_TAGS.LIST],
      query(params) {
        return {
          url: 'product-types',
          method: 'GET',
          params
        };
      }
    }),
    create: builder.mutation({
      providesTags: [PRODUCT_TYPE_TAGS.CREATE],
      invalidatesTags: [PRODUCT_TYPE_TAGS.LIST],
      query(body) {
        return {
          url: 'product-types',
          method: 'POST',
          body
        };
      }
    }),
    update: builder.mutation({
      providesTags: [PRODUCT_TYPE_TAGS.UPDATE],
      invalidatesTags: [PRODUCT_TYPE_TAGS.LIST],
      query({ body, id }) {
        return {
          url: `product-types/${id}`,
          method: 'PUT',
          body
        };
      }
    }),
    delete: builder.mutation({
      providesTags: [PRODUCT_TYPE_TAGS.DELETE],
      invalidatesTags: [PRODUCT_TYPE_TAGS.LIST],
      query(id) {
        return {
          url: `product-types/${id}`,
          method: 'DELETE'
        };
      }
    }),
    search: builder.query({
      providesTags: [PRODUCT_TYPE_TAGS.SEARCH],
      query(params) {
        return {
          url: `product-types/search`,
          method: 'GET',
          params
        };
      },
      transformResponse: (response) => {
        const { data } = response;
        const result = data
          .filter((d) => !!d.vendor)
          .map((d) => ({ label: d.vendor, value: d.vendor }));
        return result;
      }
    })
  })
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useListQuery,
  useLazyListQuery,
  useCreateMutation,
  useUpdateMutation,
  useSearchQuery,
  useLazySearchQuery,
  useDeleteMutation
} = productTypeApi;
