import Error from "@/app/error";
import AllUsers from "@/components/admin/AllUsers";
import { getAuthHeader } from "@/helpers/authHeaders";

export const metadata = {
  title: "All Users - Admin || BookIT",
  description: "This is the description for the home page of this application.",
};

const getUsers = async () => {
  const authHeaders = getAuthHeader();

  const res = await fetch(`${process.env.API_URI}/api/admin/users`, {
    headers: authHeaders.headers,
  });
  return res.json();
};

export default async function AdminUsersPage() {
  const data = await getUsers();

  if (data?.errMessage) {
    return <Error error={data} />;
  }

  return (
    <div className='container'>
      <AllUsers data={data} />
    </div>
  );
}
