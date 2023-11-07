import Home from "@/components/Home";
import Error from "./error";

export const metadata = {
  title: "Home Page - BookIT",
  description: "This is the description for the home page of this application.",
};

export const revalidate = 0;

const getRooms = async () => {
  try {
    const res = await fetch(`${process.env.API_URI}/api/rooms`);
    const data = res.json();
    return data;
  } catch (error) {
    console.log("error => ", error);
  }
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
