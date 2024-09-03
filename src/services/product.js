// Need to use the React-specific entry point to allow generating React hooks
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCSRF } from './fetchBaseQuery';

const PRODUCT_TAGS = {
  LIST: 'PRODUCT/LIST',
  CREATE: 'PRODUCT/CREATE',
  UPDATE: 'PRODUCT/UPDATE',
  DELETE: 'PRODUCT/DELETE',
  SKU_LIST: 'PRODUCT/SKU_LIST',
  INVENTORY_COUNT: 'PRODUCT/INVENTORY_COUNT',
  REPLENISHMENT_COUNT: 'PRODUCT/REPLENISHMENT_COUNT',
  SHOE_COUNT: 'PRODUCT/SHOE_COUNT',
  QUANTITIES: 'PRODUCT/QUANTITIES'
};

// Define a service using a base URL and expected endpoints
export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: baseQueryWithCSRF,
  endpoints: (builder) => ({
    list: builder.query({
      providesTags: [PRODUCT_TAGS.LIST],
      query(params) {
        return {
          url: 'products',
          method: 'GET',
          params
        };
      }
    }),
    consignors: builder.query({
      providesTags: [PRODUCT_TAGS.LIST],
      query(params) {
        return {
          url: 'consignors',
          method: 'GET',
          params
        };
      }
    }),
    create: builder.mutation({
      providesTags: [PRODUCT_TAGS.CREATE],
      invalidatesTags: [PRODUCT_TAGS.LIST],
      query(params) {
        return {
          url: 'product',
          method: 'POST',
          body: params
        };
      }
    }),
    update: builder.mutation({
      providesTags: [PRODUCT_TAGS.UPDATE],
      invalidatesTags: [PRODUCT_TAGS.LIST],
      query(params) {
        return {
          url: `product/${params.id}`,
          method: 'PUT',
          body: params
        };
      }
    }),
    deleteProduct: builder.mutation({
      providesTags: [PRODUCT_TAGS.DELETE],
      query(id) {
        return {
          url: `product/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: [PRODUCT_TAGS.LIST]
    }),
    skuList: builder.query({
      providesTags: [PRODUCT_TAGS.SKU_LIST],
      query(params) {
        return {
          url: 'product-skus',
          method: 'GET',
          params
        };
      }
    }),
    inventoryCount: builder.query({
      providesTags: [PRODUCT_TAGS.INVENTORY_COUNT],
      query() {
        return {
          url: 'inventory-count',
          method: 'GET'
        };
      }
    }),
    replenishmentCount: builder.query({
      providesTags: [PRODUCT_TAGS.REPLENISHMENT_COUNT],
      query() {
        return {
          url: 'replenishment-count',
          method: 'GET'
        };
      }
    }),
    shoeCount: builder.query({
      providesTags: [PRODUCT_TAGS.SHOE_COUNT],
      query() {
        return {
          url: 'shoe-count',
          method: 'GET'
        };
      }
    }),
    quantities: builder.query({
      providesTags: [PRODUCT_TAGS.QUANTITIES],
      query(params) {
        return {
          url: 'quantities',
          method: 'GET',
          params
        };
      }
    })
  })
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useCreateMutation,
  useDeleteProductMutation,
  useUpdateMutation,
  useListQuery,
  useLazyConsignorsQuery,
  useLazyListQuery,
  useLazySkuListQuery,

  useInventoryCountQuery,
  useReplenishmentCountQuery,
  useShoeCountQuery,
  useQuantitiesQuery
} = productApi;
