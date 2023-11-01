import Error from "@/app/error";
import Home from "@/components/Home";
import MyBookings from "@/components/booking/MyBookings";

export const metadata = {
  title: "My Bookings - BookIT",
  description: "This is the description for the home page of this application.",
};

const getBookings = async () => {
  const res = await fetch(`${process.env.API_URI}/api/bookings/me`, {
    cache: "no-cache",
    headers: {
      Cookie: `next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..ej_-gEKvxnYYtakN.p_HaxzLBC_ss_pbaPha5UFdirjzdQDXZRU1G00OkpTaT80pCMwuZrWeZLTi_gsbAgUcUcNY_PgtVv3u9rPTHlhFwwEH4RLeMdogFZPu1Uqp2rhGHwvUqPqezlly7Qsa4mcGA7RkH7IVc-aWp5zKQ4j-2XAnQxgVzjO29TNdrj-JKwq6S0nF5MivpbWXp8ljokUiQefSB7Ip7zrZn9er4It_-lG8sI70F9N4NrtX7TAOPNVc358Ik5KOFvax3wnEbs2UysPHZLN7NlU1zk81VsDVkPlRLYebgpooF9I9PrC8gicZ3OMPVNvzY42KLZO_5NCTlLD36DkYZW1JGdv_s673RY1py2aSpqb0g1P8qISPpi0JPImxNsdVDOIJ-3GyhjR9kHRmiCitpSWIUg0m9HJ8NeM9Myg_9v68XwELmBFKfkQr45SgDO_mffpc-KA.Uyb-hhonbrbgxVp_5dISiA`,
    },
  });
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
