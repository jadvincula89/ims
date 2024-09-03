// Need to use the React-specific entry point to allow generating React hooks
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCSRF } from './fetchBaseQuery';

const PRICECHANGE_TAGS = {
  DATA: 'PRICECHANGE/DATA',
  PRICECHANGE_TAGS_LIST: 'PRICECHANGE/LIST',
  VARIANTS_LIST: 'VARIANTS/LIST',
  CREATE: 'PRICECHANGE/CREATE',
  UPDATE: 'PRICECHANGE/UPDATE',
  DELETE: 'PRICECHANGE/DELETE'
};

export const pricechangeApi = createApi({
  reducerPath: 'pricechangeApi',
  baseQuery: baseQueryWithCSRF,
  endpoints: (builder) => ({
    pricechange: builder.query({
      providesTags: [PRICECHANGE_TAGS.PRICECHANGE_TAGS_LIST],
      query(params) {
        return {
          url: '/price-changes',
          method: 'GET',
          params
        };
      }
    }),
    getsingle: builder.query({
      providesTags: [PRICECHANGE_TAGS.PRICECHANGE_TAGS_LIST],
      query(params) {
        return {
          url: `/price-change/${params.id}`,
          method: 'GET',
          params
        };
      }
    }),
    pricechangedelete: builder.mutation({
      providesTags: [PRICECHANGE_TAGS.CREATE],
      query(params) {
        return {
          url: `price-change/${params.id}`,
          method: 'DELETE',
          body: params
        };
      },
      invalidatesTags: [PRICECHANGE_TAGS.PRICECHANGE_TAGS_LIST]
    }),
    pricechangeupdate: builder.mutation({
      providesTags: [PRICECHANGE_TAGS.UPDATE],
      query(params) {
        return {
          url: `price-change/${params.id}`,
          method: 'PUT',
          body: params
        };
      },
      invalidatesTags: [PRICECHANGE_TAGS.PRICECHANGE_TAGS_LIST]
    }),
    pricechangecreate: builder.mutation({
      providesTags: [PRICECHANGE_TAGS.CREATE],
      invalidatesTags: [PRICECHANGE_TAGS.PRICECHANGE_TAGS_LIST],
      query(body) {
        return {
          url: 'price-change',
          method: 'POST',
          body
        };
      }
    }),
    variants: builder.query({
      providesTags: [PRICECHANGE_TAGS.VARIANTS_LIST],
      query(params) {
        return {
          url: '/variants',
          method: 'GET',
          params
        };
      }
    })
  })
});

export const {
  usePricechangeQuery,
  useLazyGetsingleQuery,
  usePricechangedeleteMutation,
  usePricechangecreateMutation,
  usePricechangeupdateMutation,
  useLazyVariantsQuery
} = pricechangeApi;
