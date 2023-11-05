import Error from "@/app/error";
import UploadRoomImages from "@/components/admin/UploadRoomImages";
import { getAuthHeader } from "@/helpers/authHeaders";

export const metadata = {
  title: "Update Room Images - Admin || BookIT",
  description: "This is the description for the home page of this application.",
};

const getRoom = async (id: string) => {
  const authHeaders = getAuthHeader();

  const res = await fetch(`${process.env.API_URI}/api/rooms/${id}`, {
    headers: authHeaders.headers,
  });
  return res.json();
};

export default async function AdminUploadImagesPage({
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
      <UploadRoomImages data={data} />
    </div>
  );
}
