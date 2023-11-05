export const revalidateTag = async (tag: string) => {
  if (!tag || !process.env.REVALIDATE_TOKEN) {
    console.error("Missing tag or secret.");
    return;
  }
  await fetch(
    `${process.env.API_URI}/api/revalidate?tag=${tag}&secret=${process.env.REVALIDATE_TOKEN}`,
    { method: "POST" }
  );
};
