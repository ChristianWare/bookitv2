"use client";

import { IRoom } from "@/backend/models/room";
import { calculateDaysOfStay } from "@/helpers/helpers";
import {
  useGetBookedDatesQuery,
  useLazyCheckBookingAvailabilityQuery,
  useNewBookingsMutation,
} from "@/redux/api/bookingApi";
import { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

interface Props {
  room: IRoom;
}

const BookingDatePicker = ({ room }: Props) => {
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [daysOfStay, setDaysOfStay] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

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

  const bookRoom = () => {
    const bookingData = {
      room: room?._id,
      checkInDate,
      checkOutDate,
      daysOfStay,
      amountPaid: room.pricePerNight * daysOfStay,
      paymentInfo: {
        id: "STRIPE_ID",
        status: "PAID",
      },
    };

    newBooking(bookingData);
  };

  return (
    <div className='booking-card shadow p-4'>
      <p className='price-per-night'>
        <b>${room?.pricePerNight}</b> / night
      </p>
      <hr />
      <p className='mt-5 mb-3'>Pick Check In & Check Out Date</p>

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
          Room is available. Book now.
        </div>
      )}
      {isAvailable === false && (
        <div className='alert alert-danger my-3'>
          Room not available. Try different dates.
        </div>
      )}

      {daysOfStay > 0 && (
        <div className='total-cost'>
          Length of Stay: <b>{daysOfStay} days</b>
          <br />
          <br />
          Total Cost: <b>${totalCost}</b>
        </div>
      )}

      <button className='btn py-3 form-btn w-100' onClick={bookRoom}>
        Pay
      </button>
    </div>
  );
};
export default BookingDatePicker;
