import { Toaster } from "react-hot-toast";

export function Globalprovider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
}
