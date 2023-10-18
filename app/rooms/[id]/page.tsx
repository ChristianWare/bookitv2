import Error from "@/app/error";
import RoomDetails from "@/components/room/RoomDetails";



interface Props {
  params: { id: string };
}

const getRoom = async (id: string) => {
  const res = await fetch(`${process.env.API_URI}/api/rooms/${id}`);
  return res.json();
};

export default async function RoomDetailsPage({ params }: Props) {
  const data = await getRoom(params?.id);
  
  if (data?.message) {
    return <Error error={data} />;
  }
  
  // console.log(data);
  
  return (
    <div>
      <h1>{data?.room?.name}</h1>
      <RoomDetails data={data} />
    </div>
  );
}


export async function generateMetadata({ params }: Props) {
  const data = await getRoom(params?.id);

  return {
    title: data?.room?.name
  }
  
}