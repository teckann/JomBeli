"use client";

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Style from "./page.module.css"

const CourierMapView = dynamic(
  () => import('@/app/_components/CourierMapView/CourierMapView'),
  { ssr: false }
);

export default function NavigationPage() {
  return (
    <div className={Style.navPageWrapper}>
      <Link 
        className={Style.link}
        href="/courier" 
      >
        ← Back to Courier Home
      </Link>

      <CourierMapView />
    </div>
  );
}