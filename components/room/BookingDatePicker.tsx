"use client";

import { IRoom } from "@/backend/models/room";
import { calculateDaysOfStay } from "@/helpers/helpers";
import {
  useGetBookedDatesQuery,
  useLazyCheckBookingAvailabilityQuery,
  useLazyStripeCheckoutQuery,
  useNewBookingsMutation,
} from "@/redux/api/bookingApi";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

interface Props {
  room: IRoom;
}

const BookingDatePicker = ({ room }: Props) => {
  const [checkInDate, setCheckInDate] = useState<null | Date>(null);
  const [checkOutDate, setCheckOutDate] = useState<null | Date>(null);
  const [daysOfStay, setDaysOfStay] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const router = useRouter();

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [newBooking] = useNewBookingsMutation();

  const [checkBookingAvailability, { data }] =
    useLazyCheckBookingAvailabilityQuery();

  const isAvailable = data?.isAvailable;

  const { data: { bookedDates: dates } = {} } = useGetBookedDatesQuery(
    room._id
  );

  const excludeDates = dates?.map((date: string) => new Date(date)) || [];

  const onChange = (dates: Date[]) => {
    const [checkInDate, checkOutDate] = dates;

    setCheckInDate(checkInDate);
    setCheckOutDate(checkOutDate);

    if (checkInDate && checkOutDate) {
      const days = calculateDaysOfStay(checkInDate, checkOutDate);

      setDaysOfStay(days);
      setTotalCost(room.pricePerNight * days); // Calculate and set the total cost

      // check Booking Availability:
      checkBookingAvailability({
        id: room._id,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
      });
    }
  };

  const [stripeCheckout, { error, isLoading, data: checkoutData }] =
    useLazyStripeCheckoutQuery();

  useEffect(() => {
    if (error && "data" in error) {
      toast.error(error?.data?.errMessage);
    }

    if (checkoutData) {
      router.replace(checkoutData?.url);
    }
  }, [error, checkoutData, router]);

  const bookRoom = () => {
    if (checkInDate && checkOutDate) {
      const amount = room.pricePerNight * daysOfStay;
      const checkoutData = {
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
        daysOfStay,
        amount,
      };

      stripeCheckout({ id: room?._id, checkoutData });
    } else {
      // Handle the case where checkInDate or checkOutDate is null
      console.error("Check-in and check-out dates are required.");
    }
  };

  // const bookRoom = () => {
  //   const bookingData = {
  //     room: room?._id,
  //     checkInDate,
  //     checkOutDate,
  //     daysOfStay,
  //     amountPaid: room.pricePerNight * daysOfStay,
  //     paymentInfo: {
  //       id: "STRIPE_ID",
  //       status: "PAID",
  //     },
  //   };

  //   newBooking(bookingData);
  // };

  return (
    <div className='booking-card shadow p-4'>
      <p className='price-per-night'>
        <b>${room?.pricePerNight}</b> / night
      </p>
      <hr />
      <p className='mt-5 mb-3'>Select Your Dates:</p>

      <DatePicker
        className='w-100'
        selected={checkInDate}
        onChange={onChange}
        startDate={checkInDate}
        endDate={checkOutDate}
        minDate={new Date()}
        excludeDates={excludeDates}
        selectsRange
        inline
      />

      {isAvailable === true && (
        <div className='alert alert-success my-3'>
          Room is available. Book now for{" "}
          <b>
            $
            {totalCost.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </b>
        </div>
      )}
      {isAvailable === false && (
        <div className='alert alert-danger my-3'>
          Room not available. Try different dates.
        </div>
      )}

      {isAvailable && !isAuthenticated && (
        <div className='alert alert-danger' my-3>
          Login to book room.
        </div>
      )}

      {/* {isAvailable && isAuthenticated && ( */}
      <button
        className='btn py-3 form-btn w-100'
        onClick={bookRoom}
        disabled={!checkInDate || !checkOutDate || !isAvailable || isLoading}
      >
        Book Now
      </button>
      {/* )} */}
    </div>
  );
};
export default BookingDatePicker;
