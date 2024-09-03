// Need to use the React-specific entry point to allow generating React hooks
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCSRF } from './fetchBaseQuery';

const STOCKTAKE_TAGS = {
  STOCKTAKE: 'STOCKTAKE',
  STOCKTAKE_LIST: 'STOCKTAKE_LIST',
  STOCKTAKE_DETAILS: 'STOCKTAKE_DETAILS',
  SADJ_LIST: 'SADJ_LIST'
};

// Define a service using a base URL and expected endpoints
export const stocktakeApi = createApi({
  reducerPath: 'stocktakeApi',
  baseQuery: baseQueryWithCSRF,
  endpoints: (builder) => ({
    list: builder.query({
      providesTags: [STOCKTAKE_TAGS.STOCKTAKE_LIST],
      query(params) {
        return {
          url: 'stock-takes',
          method: 'GET',
          params
        };
      }
    }),
    getsingle: builder.query({
      providesTags: [STOCKTAKE_TAGS.STOCKTAKE_LIST],
      query(params) {
        return {
          //   url: `/stock-take/${params.id}`,
          url: `/stake/items`,
          method: 'GET',
          params
        };
      }
    }),
    getdraftsadj: builder.query({
      providesTags: [STOCKTAKE_TAGS.SADJ_LIST],
      query(params) {
        return {
          url: `/stock-adjustments`,
          method: 'GET',
          params
        };
      }
    }),
    update: builder.mutation({
      providesTags: [STOCKTAKE_TAGS.STOCKTAKE],
      query(params) {
        return {
          url: `stock-take/${params.id}`,
          method: 'PUT',
          body: params
        };
      },
      invalidatesTags: [STOCKTAKE_TAGS.STOCKTAKE_LIST]
    }),
    create: builder.mutation({
      providesTags: [STOCKTAKE_TAGS.STOCKTAKE],
      query(body) {
        return {
          url: 'stock-take',
          method: 'POST',
          body
        };
      },
      invalidatesTags: [STOCKTAKE_TAGS.STOCKTAKE_LIST]
    }),
    delete: builder.mutation({
      providesTags: [STOCKTAKE_TAGS.STOCKTAKE],
      query(params) {
        return {
          url: `stock-take/${params.id}`,
          method: 'DELETE',
          body: params
        };
      },
      invalidatesTags: [STOCKTAKE_TAGS.STOCKTAKE_LIST]
    }),
    generate: builder.mutation({
      providesTags: [STOCKTAKE_TAGS.STOCKTAKE],
      query(body) {
        return {
          url: 'generate-sadj',
          method: 'POST',
          body
        };
      }
    }),
    counter: builder.mutation({
      providesTags: [STOCKTAKE_TAGS.STOCKTAKE],
      query(body) {
        return {
          url: 'counter',
          method: 'POST',
          body
        };
      }
    }),
    saveSTAKEItems: builder.mutation({
      query(body) {
        return {
          url: 'stock-take/items',
          method: 'POST',
          body
        };
      }
    }),
    scanBarcode: builder.mutation({
      query(params) {
        return {
          url: `${params.id}/scan-barcode`,
          method: 'POST',
          body: params
        };
      }
    })
  })
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useLazyGetsingleQuery,
  useLazyGetdraftsadjQuery,
  useListQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useCounterMutation,
  useGenerateMutation,
  useSaveSTAKEItemsMutation,
  useScanBarcodeMutation
} = stocktakeApi;
