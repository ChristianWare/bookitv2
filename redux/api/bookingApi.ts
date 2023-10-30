import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    newBookings: builder.mutation({
      query(body) {
        return {
          url: "/bookings",
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const { useNewBookingsMutation } = bookingApi;
