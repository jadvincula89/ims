// Need to use the React-specific entry point to allow generating React hooks
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCSRF } from './fetchBaseQuery';

const LOCATION_TAGS = {
  LOCATION: 'LOCATION',
  LOCATION_LIST: 'LOCATION_LIST',
  LOCATION_DETAILS: 'LOCATION_DETAILS'
};

// Define a service using a base URL and expected endpoints
export const locationApi = createApi({
  reducerPath: 'locationApi',
  baseQuery: baseQueryWithCSRF,
  endpoints: (builder) => ({
    locationList: builder.query({
      providesTags: [LOCATION_TAGS.LOCATION_LIST],
      query(params) {
        return {
          url: 'locations',
          method: 'GET',
          params
        };
      }
    }),
    locationListAsOptions: builder.query({
      providesTags: [LOCATION_TAGS.LOCATION_LIST],
      query(params) {
        return {
          url: 'locations',
          method: 'GET',
          params
        };
      },
      transformResponse: (response) => {
        const options = response.data.map((r) => ({
          label: r.name,
          value: r.id
        }));
        return options;
      }
    }),
    locationCreate: builder.mutation({
      providesTags: [LOCATION_TAGS.LOCATION],
      query(params) {
        return {
          url: 'location',
          method: 'POST',
          body: params
        };
      },
      invalidatesTags: [LOCATION_TAGS.LOCATION_LIST]
    }),
    locationUpdate: builder.mutation({
      providesTags: [LOCATION_TAGS.LOCATION],
      query(params) {
        return {
          url: `location/${params.id}`,
          method: 'PUT',
          body: params
        };
      },
      invalidatesTags: [LOCATION_TAGS.LOCATION_LIST]
    }),
    locationDelete: builder.mutation({
      providesTags: [LOCATION_TAGS.LOCATION],
      query(params) {
        return {
          url: `location/${params.id}`,
          method: 'DELETE',
          body: params
        };
      },
      invalidatesTags: [LOCATION_TAGS.LOCATION_LIST]
    })
  })
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useLocationListQuery,
  useLocationCreateMutation,
  useLocationUpdateMutation,
  useLocationDeleteMutation,
  useLocationListAsOptionsQuery
  // useSizeDeleteMutation
} = locationApi;
