"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import store from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "@/store/authSlice";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}

function AuthWrapper({ children }) {
  const token = useSelector(selectCurrentToken);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (
      !token &&
      !pathname.startsWith("/login") &&
      !pathname.startsWith("/register")
    ) {
      router.push("/login");
    }
  }, [token, pathname, router]);

  return children;
}
