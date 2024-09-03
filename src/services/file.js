// Need to use the React-specific entry point to allow generating React hooks
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCSRF } from './fetchBaseQuery';

// Define a service using a base URL and expected endpoints
export const fileApi = createApi({
  reducerPath: 'fileApi',
  baseQuery: baseQueryWithCSRF,
  endpoints: (builder) => ({
    imageUpload: builder.mutation({
      query(params) {
        return {
          url: 'upload/image',
          method: 'POST',
          body: params
        };
      }
    })
  })
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useImageUploadMutation } = fileApi;
