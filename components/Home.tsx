import RoomItem from "./room/RoomItem";
import { IRoom } from "@/backend/models/room";

interface Props {
  data: {
    success: boolean;
    resPerPage: number;
    filteredRoomsCount: number;
    rooms: IRoom[];
  };
}

const Home = ({ data }: Props) => {
  const { rooms } = data;

  return (
    <div>
      <section id='rooms' className='container mt-5'>
        <h2 className='mb-3 ml-2 stays-heading'>All Rooms</h2>

        <div className='row mt-4'>
          {rooms?.length === 0 ? (
            <div className='alret alret-danger mt-5 w-100'>
              <b>No Rooms.</b>
            </div>
          ) : (
            rooms?.map((room) => <RoomItem key={room._id} room={room} />)
          )}
        </div>
      </section>
    </div>
  );
};
export default Home;
