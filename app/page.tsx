import Home from "@/components/Home";
import Error from "./error";

export const metadata = {
  title: "Home Page - BookIT",
  description: "This is the description for the home page of this application.",
};

const getRooms = async () => {
  const res = await fetch(`${process.env.API_URI}/api/rooms`);
  return res.json();
};

export default async function HomePage() {
  const data = await getRooms();

  if (data?.errMessage) {
    return <Error error={data} />;
  }

  return (
    <div className='container'>
      <Home data={data} />
    </div>
  );
}
