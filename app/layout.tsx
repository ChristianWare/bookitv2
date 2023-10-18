import "bootstrap/dist/css/bootstrap.css";

import { Globalprovider } from "@/GlobalProvider";
import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Globalprovider>
          <Header />
          {children}
          <Footer />
        </Globalprovider>

        <Script src='https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js'></Script>
        <Script src='https://kit.fontawesome.com/b6b7b8a602.js'></Script>
      </body>
    </html>
  );
}
