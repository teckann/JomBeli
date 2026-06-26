"use client";

import Styles from './AdminDeactiveProductButton.module.css';
import { deactiveProduct } from '@/app/_lib/actions';
import { useRouter } from 'next/navigation';

export default function AdminDeactiveProductButton({productId}) {

    const router = useRouter();

    const handleClick = async () => {
        await deactiveProduct(productId);
        router.refresh();
    }
    return (
        <button className="btn btn-primary" title="Deactive Product" onClick={() => handleClick()}>
            Deactive
        </button>       
    );
}