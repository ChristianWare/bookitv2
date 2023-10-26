"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./redux/store";

export function Globalprovider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      <Provider store={store}>
        <SessionProvider>{children}</SessionProvider>
      </Provider>
    </>
  );
}
0