import Error from "@/app/error";
import UpdateUser from "@/components/admin/UpdateUser";
import { getAuthHeader } from "@/helpers/authHeaders";

interface Props {
  params: { id: string };
}

export const metadata = {
  title: "Update User - Admin || BookIt",
};

const getUser = async (id: string) => {
  const authHeader = getAuthHeader();

  const res = await fetch(
    `${process.env.API_URI}/api/admin/users/${id}`,
    authHeader
  );
  return res.json();
};

export default async function UpdateUserPage({ params }: Props) {
  const data = await getUser(params?.id);

  if (data?.errMessage) {
    return <Error error={data} />;
  }

  return (
    <div>
      <UpdateUser data={data} />
    </div>
  );
}
