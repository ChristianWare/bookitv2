import RoomReviews from "@/components/admin/RoomReviews";

export const metadata = {
  title: "Room Reviews - BookIT",
  description: "This is the description for the home page of this application.",
};

export default async function AdminRoomReviewsPage() {
  return (
    <div className='container'>
      <RoomReviews />
    </div>
  );
}
