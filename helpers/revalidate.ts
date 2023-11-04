export const revalidateTag = async (tag: string) => {
  await fetch(
    `${process.env.API_URI}/api/revalidate?tag=${tag}&secret=${process.env.REVALIDATE_TOKEN}`,
    { method: "POST" }
  );
};
