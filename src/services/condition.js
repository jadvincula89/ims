// Need to use the React-specific entry point to allow generating React hooks
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCSRF } from './fetchBaseQuery';

const CONDITION_TAGS = {
  CONDITION: 'CONDITION',
  CONDITION_LIST: 'CONDITION_LIST',
  CONDITION_DETAILS: 'CONDITION_DETAILS'
};

// Define a service using a base URL and expected endpoints
export const conditionApi = createApi({
  reducerPath: 'conditionApi',
  baseQuery: baseQueryWithCSRF,
  endpoints: (builder) => ({
    conditions: builder.query({
      providesTags: [CONDITION_TAGS.CONDITION_LIST],
      query(params) {
        return {
          url: 'conditions',
          method: 'GET',
          params
        };
      }
    }),
    conditionCreate: builder.mutation({
      providesTags: [CONDITION_TAGS.CONDITION],
      query(params) {
        return {
          url: 'condition',
          method: 'POST',
          body: params
        };
      },
      invalidatesTags: [CONDITION_TAGS.CONDITION_LIST]
    }),
    conditionUpdate: builder.mutation({
      providesTags: [CONDITION_TAGS.CONDITION],
      query(params) {
        return {
          url: `condition/${params.id}`,
          method: 'PUT',
          body: params
        };
      },
      invalidatesTags: [CONDITION_TAGS.CONDITION_LIST]
    }),
    conditionDelete: builder.mutation({
      providesTags: [CONDITION_TAGS.CONDITION],
      query(params) {
        return {
          url: `condition/${params.id}`,
          method: 'DELETE',
          body: params
        };
      },
      invalidatesTags: [CONDITION_TAGS.CONDITION_LIST]
    })
  })
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {
  useConditionsQuery,
  useConditionCreateMutation,
  useConditionUpdateMutation,
  useConditionDeleteMutation
} = conditionApi;
