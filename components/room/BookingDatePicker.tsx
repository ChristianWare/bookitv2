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
      if (isAuthenticated) {
        const amount = room.pricePerNight * daysOfStay;
        const checkoutData = {
          checkInDate: checkInDate.toISOString(),
          checkOutDate: checkOutDate.toISOString(),
          daysOfStay,
          amount,
        };
        stripeCheckout({ id: room?._id, checkoutData });
      } else {
        // User is not authenticated, show a toast notification
        // toast.error("Login to book the room");
        router.push("/login");
      }
    } else {
      // Handle the case where checkInDate or checkOutDate is null
      console.error("Check-in and check-out dates are required.");
    }
  };

  const clearDates = () => {
    setCheckInDate(null);
    setCheckOutDate(null);
  };

  const formatDate = (date: any) => {
    const options = { year: "numeric", month: "short", day: "2-digit" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    const day = date.getDate();
    const dayStr = day.toString();
    const lastDigit = day % 10;

    let suffix = "th";
    if (day > 10 && day < 20) {
      suffix = "th"; // Special case for teens
    } else if (lastDigit === 1) {
      suffix = "st";
    } else if (lastDigit === 2) {
      suffix = "nd";
    } else if (lastDigit === 3) {
      suffix = "rd";
    }

    // Append the suffix to the day part
    const formattedWithSuffix = formattedDate.replace(dayStr, dayStr + suffix);

    return formattedWithSuffix;
  };

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

      {isAvailable === true && checkInDate && checkOutDate && (
        <>
          <div className='alert alert-success my-3'>
            Room is available. Book now.
          </div>
          <div>
            <b>Length of stay: </b>
            {daysOfStay} {daysOfStay === 1 ? "day" : "days"}
            <hr />
            <b>Check-In:</b> {formatDate(checkInDate)} @ 10:00 AM
            <hr />
            <b>Check-Out:</b> {formatDate(checkOutDate)} @ 10:00 AM
            <hr />
            <b>Total Cost: </b> $
            {totalCost.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            <hr />
            {/* <b>Total Cost: </b> 300.00 $ */}
          </div>
        </>
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
      {/* {checkInDate && checkOutDate && (
        <button
          className='btn py-3 form-btn w-100'
          onClick={clearDates}
          disabled={!checkInDate || !checkOutDate || !isAvailable || isLoading}
        >
          Clear
        </button>
      )} */}
      <button
        className='btn py-3 form-btn w-100'
        onClick={bookRoom}
        disabled={!checkInDate || !checkOutDate || !isAvailable || isLoading}
      >
        Book Now
      </button>
    </div>
  );
};
export default BookingDatePicker;
