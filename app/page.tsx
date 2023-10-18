import Home from "@/components/Home";

const getRooms = async () => {
  const res = await fetch("http://localhost:3000/api/rooms", {
    cache: "no-store",
  });
  return res.json();
};

export default async function HomePage() {
  const rooms = await getRooms();
  console.log("resPerPage =>", rooms.resPerPage);
  return (
    <div className='container'>
      <Home />
    </div>
  );
}
