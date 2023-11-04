import NewRoom from "@/components/admin/NewRoom";

export const metadata = {
  title: "Create New Room - Admin || BookIT",
  description: "This is the description for the home page of this application.",
};

export default async function NewRoomPage() {
  return (
    <div className='container'>
      <NewRoom />
    </div>
  );
}
