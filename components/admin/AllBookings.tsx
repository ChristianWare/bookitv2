"use client";

import { IBooking } from "@/backend/models/booking";
import { MDBDataTable } from "mdbreact";
import Link from "next/link";

interface Props {
  data: {
    bookings: IBooking[];
  };
}

const AllBookings = ({ data }: Props) => {
  const bookings = data?.bookings;

  const formatDate = (date: any) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const setBookings = () => {
    const data: { columns: any[]; rows: any[] } = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Date Booked",
          field: "datebooked",
          sort: "asc",
        },
        {
          label: "Check In",
          field: "checkin",
          sort: "asc",
        },
        {
          label: "Check Out",
          field: "checkout",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    bookings
      ?.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .forEach((booking) => {
        data?.rows?.push({
          id: booking._id,
          datebooked: formatDate(booking.createdAt),
          checkin: formatDate(booking?.checkInDate),
          checkout: formatDate(booking?.checkOutDate),
          actions: (
            <>
              <Link
                href={`/bookings/${booking._id}`}
                className='btn btn-primary'
              >
                <i className='fa fa-eye'></i>
              </Link>
              <Link
                href={`/bookings/invoice/${booking._id}`}
                className='btn btn-success ms-2'
              >
                <i className='fa fa-receipt'></i>
              </Link>
              <button className="btn btn-outline-danger mx-2">
                <i className="fa fa-trash"></i>
              </button>
            </>
          ),
        });
      });

    return data;
  };

  return (
    <div className='container'>
      <h1 className='my-5'>{bookings?.length} Bookings</h1>
      <MDBDataTable
        data={setBookings()}
        className='px-3'
        bordered
        striped
        hover
      />
    </div>
  );
};
export default AllBookings;
