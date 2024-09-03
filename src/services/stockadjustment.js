// Need to use the React-specific entry point to allow generating React hooks
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCSRF } from './fetchBaseQuery';

const STOCKADJUSTMENT_TAGS = {
  DATA: 'STOCKADJUSTMENT/DATA',
  STOCKADJUSTMENT_TAGS_LIST: 'STOCKADJUSTMENT/LIST',
  VARIANTS_LIST: 'VARIANTS/LIST',
  CREATE: 'STOCKADJUSTMENT/CREATE',
  UPDATE: 'STOCKADJUSTMENT/UPDATE',
  DELETE: 'STOCKADJUSTMENT/DELETE'
};

export const stockadjustmentApi = createApi({
  reducerPath: 'stockadjustmentApi',
  baseQuery: baseQueryWithCSRF,
  endpoints: (builder) => ({
    stockadjustment: builder.query({
      providesTags: [STOCKADJUSTMENT_TAGS.STOCKADJUSTMENT_TAGS_LIST],
      query(params) {
        return {
          url: '/stock-adjustments',
          method: 'GET',
          params
        };
      }
    }),
    getsingle: builder.query({
      providesTags: [STOCKADJUSTMENT_TAGS.STOCKADJUSTMENT_TAGS_LIST],
      query(params) {
        return {
          url: `/stock-adjustment/${params.id}`,
          method: 'GET',
          params
        };
      }
    }),
    getdropdown: builder.query({
      providesTags: [STOCKADJUSTMENT_TAGS.STOCKADJUSTMENT_TAGS_LIST],
      query(params) {
        return {
          url: `/dropdown/${params.id}`,
          method: 'GET',
          params
        };
      }
    }),
    getconfig: builder.query({
      query(params) {
        return {
          url: `/configurations`,
          method: 'GET',
          params
        };
      }
    }),
    stockadjustmentdelete: builder.mutation({
      providesTags: [STOCKADJUSTMENT_TAGS.DELETE],
      query(params) {
        return {
          url: `stock-adjustment/${params.id}`,
          method: 'DELETE',
          body: params
        };
      },
      invalidatesTags: [STOCKADJUSTMENT_TAGS.STOCKADJUSTMENT_TAGS_LIST]
    }),
    stockadjustmentupdate: builder.mutation({
      providesTags: [STOCKADJUSTMENT_TAGS.UPDATE],
      query(params) {
        return {
          url: `stock-adjustment/${params.id}`,
          method: 'PUT',
          body: params
        };
      },
      invalidatesTags: [STOCKADJUSTMENT_TAGS.STOCKADJUSTMENT_TAGS_LIST]
    }),
    stockadjustmentcreate: builder.mutation({
      providesTags: [STOCKADJUSTMENT_TAGS.CREATE],
      invalidatesTags: [STOCKADJUSTMENT_TAGS.STOCKADJUSTMENT_TAGS_LIST],
      query(body) {
        return {
          url: 'stock-adjustment',
          method: 'POST',
          body
        };
      }
    }),
    variants: builder.query({
      providesTags: [STOCKADJUSTMENT_TAGS.VARIANTS_LIST],
      query(params) {
        return {
          url: '/variants',
          method: 'GET',
          params
        };
      }
    }),
    progress: builder.query({
      query(params) {
        return {
          url: 'sadj/progress',
          method: 'GET',
          params
        };
      }
    }),
    getsadjlogs: builder.query({
      query(params) {
        return {
          url: `sadjlogs/${params.id}`,
          method: 'GET',
          params
        };
      }
    }),
    getSADJItems: builder.query({
      query(params) {
        return {
          url: 'sadj/items',
          method: 'GET',
          params
        };
      }
    }),
    getSADJItemslist: builder.query({
      query(params) {
        return {
          url: 'sadj/items',
          method: 'GET',
          params
        };
      }
    }),
    saveSADJItems: builder.mutation({
      query(body) {
        return {
          url: 'sadj/items',
          method: 'POST',
          body
        };
      }
    })
  })
});

export const {
  useStockadjustmentQuery,
  useLazyGetsingleQuery,
  useLazyGetsadjlogsQuery,
  useLazyGetdropdownQuery,
  useGetdropdownQuery,
  useLazyGetconfigQuery,
  useStockadjustmentdeleteMutation,
  useStockadjustmentcreateMutation,
  useStockadjustmentupdateMutation,
  useLazyVariantsQuery,
  useSaveSADJItemsMutation,
  useProgressQuery,
  useGetSADJItemsQuery,
  useLazyGetSADJItemslistQuery
} = stockadjustmentApi;
