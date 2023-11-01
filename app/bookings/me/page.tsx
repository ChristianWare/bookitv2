import Error from "@/app/error";
import Home from "@/components/Home";
import MyBookings from "@/components/booking/MyBookings";
import { getAuthHeader } from "@/helpers/authHeaders";

export const metadata = {
  title: "My Bookings - BookIT",
  description: "This is the description for the home page of this application.",
};

const getBookings = async () => {
  const authHeader = getAuthHeader();

  const res = await fetch(`${process.env.API_URI}/api/bookings/me`, authHeader);
  return res.json();
};

export default async function MyBookingsPage() {
  const data = await getBookings();

  if (data?.errMessage) {
    return <Error error={data} />;
  }

  return (
    <div className='container'>
      <MyBookings data={data} />
    </div>
  );
}
