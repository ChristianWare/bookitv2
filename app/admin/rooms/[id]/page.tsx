import Error from "@/app/error";
import Home from "@/components/Home";
import AllRooms from "@/components/admin/AllRooms";
import UpdateRoom from "@/components/admin/UpdateRoom";
import { getAuthHeader } from "@/helpers/authHeaders";

export const metadata = {
  title: "Update Room - Admin || BookIT",
  description: "This is the description for the home page of this application.",
};

const getRoom = async (id: string) => {
  const authHeaders = getAuthHeader();

  const res = await fetch(`${process.env.API_URI}/api/rooms/${id}`, {
    headers: authHeaders.headers,
  });
  return res.json();
};

export default async function AdminRoomsPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getRoom(params?.id);

  if (data?.errMessage) {
    return <Error error={data} />;
  }

  return (
    <div className='container'>
      <UpdateRoom data={data} />
    </div>
  );
}
