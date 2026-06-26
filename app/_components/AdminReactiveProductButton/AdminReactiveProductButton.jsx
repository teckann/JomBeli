"use client";

import Styles from './AdminReactiveProductButton.module.css';
import { reactiveProduct } from '@/app/_lib/actions';
import { useRouter } from 'next/navigation';

export default function AdminReactiveProductButton({productId}) {

    const router = useRouter();

    const handleClick = async () => {
        await reactiveProduct(productId);
        router.refresh();
    }
    return (
        <button className={`btn btn-primary ${ Styles.green} `} title="Deactive Product" onClick={() => handleClick()}>
            Reactive
        </button>       
    );
}