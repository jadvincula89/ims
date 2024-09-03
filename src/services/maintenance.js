// Need to use the React-specific entry point to allow generating React hooks
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCSRF } from './fetchBaseQuery';

const MAINTENANCE_TAGS = {
  PRODUCTS: 'PRODUCTS'
};

// Define a service using a base URL and expected endpoints
export const maintenanceApi = createApi({
  reducerPath: 'maintenanceApi',
  baseQuery: baseQueryWithCSRF,
  tagTypes: [MAINTENANCE_TAGS.PRODUCTS],
  endpoints: (builder) => ({
    products: builder.query({
      query(params) {
        return {
          url: 'products',
          method: 'GET',
          params
        };
      }
    }),
    productTypes: builder.query({
      query(params) {
        return {
          url: 'product-types',
          method: 'GET',
          params
        };
      }
    }),
    locations: builder.query({
      query(params) {
        return {
          url: 'locations',
          method: 'GET',
          params
        };
      }
    }),
    configurations: builder.query({
      query(params) {
        return {
          url: 'configurations',
          method: 'GET',
          params
        };
      }
    }),
    conditions: builder.query({
      query(params) {
        return {
          url: 'conditions',
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
  useProductsQuery,
  useConfigurationsQuery,
  useProductTypesQuery,
  useLocationsQuery,
  useConditionsQuery
} = maintenanceApi;
