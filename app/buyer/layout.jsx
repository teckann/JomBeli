"use client";

import BuyerNavBar from "../_components/BuyerNavBar/BuyerNavBar";
import { usePathname } from "next/navigation";

export default function BuyerLayout({ children }) {
  const pathname = usePathname();

  if (pathname === "/buyer/chat") return children;

  return (
    <>
      <BuyerNavBar />
      {children}
    </>
  );
}
