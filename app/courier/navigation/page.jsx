"use client"

import dynamic from 'next/dynamic';
import Link from 'next/link';

const CourierMapView = dynamic(
  () => import('@/app/_components/CourierMapView/CourierMapView'),
  { ssr: false }
);

export default function NavigationPage(){
    return(
        <div>
            <Link href="/">Back to home</Link>
            <CourierMapView/>
        </div>
    );
}