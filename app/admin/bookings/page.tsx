import Error from "@/app/error";
import AllBookings from "@/components/admin/AllBookings";
import { getAuthHeader } from "@/helpers/authHeaders";

export const metadata = {
  title: "All Bookings - Admin || BookIT",
  description: "This is the description for the home page of this application.",
};

const getBookings = async () => {
  const authHeaders = getAuthHeader();

  const res = await fetch(`${process.env.API_URI}/api/admin/bookings`, {
    headers: authHeaders.headers,
  });
  return res.json();
};

export default async function AdminBookingsPage() {
  const data = await getBookings();

  if (data?.errMessage) {
    return <Error error={data} />;
  }

  return (
    <div className='container'>
      <AllBookings data={data} />
    </div>
  );
}
