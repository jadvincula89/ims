// Need to use the React-specific entry point to allow generating React hooks
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCSRF } from './fetchBaseQuery';

const SHELFS_TAGS = {
  SHELF: 'Shelf/SHELF',
  SHELF_LIST: 'Shelf/CATEGORY_LIST',
  CREATE: 'Shelf/CREATE',
  UPDATE: 'Shelf/UPDATE'
};

// Define a service using a base URL and expected endpoints
export const shelfApi = createApi({
  reducerPath: 'shelfApi',
  baseQuery: baseQueryWithCSRF,
  endpoints: (builder) => ({
    shelf: builder.query({
      providesTags: [SHELFS_TAGS.SHELF_LIST],
      query(params) {
        return {
          url: '/shelf',
          method: 'GET',
          params
        };
      }
    }),
    shelfdelete: builder.mutation({
      providesTags: [SHELFS_TAGS.SHELF],
      query(params) {
        return {
          url: `shelf/${params.id}`,
          method: 'DELETE',
          body: params
        };
      },
      invalidatesTags: [SHELFS_TAGS.SHELF_LIST]
    }),
    create: builder.mutation({
      providesTags: [SHELFS_TAGS.CREATE],
      invalidatesTags: [SHELFS_TAGS.SHELF_LIST],
      query(body) {
        return {
          url: 'shelf',
          method: 'POST',
          body
        };
      }
    }),
    update: builder.mutation({
      providesTags: [SHELFS_TAGS.UPDATE],
      invalidatesTags: [SHELFS_TAGS.SHELF_LIST],
      query({ body, id }) {
        return {
          url: `shelf/${id}`,
          method: 'PUT',
          body
        };
      }
    })
  })
});

export const {
  useShelfQuery,
  useShelfdeleteMutation,
  useCreateMutation,
  useUpdateMutation
} = shelfApi;
