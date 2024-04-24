import Error from "@/app/error";
import BookingDetails from "@/components/booking/BookingDetails";
import { getAuthHeader } from "@/helpers/authHeaders";

export const metadata = {
  title: "My Bookings Details - BookIT",
  description: "This is the description for the home page of this application.",
};

const getBooking = async (id: string) => {
  const authHeader = getAuthHeader();

  const res = await fetch(
    `${process.env.API_URI}/api/bookings/${id}`,
    authHeader
  );
  return res.json();
};

export default async function MyBookingsPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getBooking(params?.id);
  console.log(data);

  if (data?.errMessage) {
    return <Error error={data} />;
  }

  return (
    <div className='container'>
      <BookingDetails data={data} />
    </div>
  );
}
