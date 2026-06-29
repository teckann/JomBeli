"use client";

import { useState } from 'react';
import Styles from "./AdminSliceShow.module.css";
import Link from 'next/link'

export default function AdminSliceShow({datas}) {

    let [pageCounter, setPageCounter] = useState(1);

    const handleDeduct = () => {
        if (pageCounter > 1) {
            setPageCounter(prev => prev - 1);
        }
    }

    const handleAdd = () => {
        if (pageCounter < maxCounter) {
            setPageCounter(prev => prev + 1);
        }
    }

    const maxRowsForSlice = 4;

    const maxCounter = Math.max(1, datas.length - maxRowsForSlice + 1);

    const startSlicePoint = (pageCounter - 1);
    const endSlicePoint = startSlicePoint + maxRowsForSlice;

    // set the copy of slice array
    const datasSliced = datas.slice(startSlicePoint, endSlicePoint);

    const expandable = datas.length > 4;
    
    return (
        <div>
            <div className={ Styles.NavContainer }>
                <button className={ `${!expandable && Styles.hide}` } onClick={handleDeduct}>
                    <BackIcon />
                </button>
            </div>
            <div>
                {datasSliced.map((data, index) => 
                    <AdminRefundSliceComponent key={index} data={data} />
                )}
            </div>
            <div className={ Styles.NavContainer }>
                <button className={ `${!expandable && Styles.hide}` } onClick={handleAdd}>
                    <NextIcon />
                </button>
            </div>
        </div>
    )
}

export function NextIcon() {
    return (
        <svg className={ `${Styles.icon} ${Styles.revert}` } xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={30} height={30}>
            <title>{"back_2_fill"}</title>
            <g fill="none" fillRule="nonzero">
            <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z" />
            <path
                fill="black"
                d="M7.16 10.972A7 7 0 0 1 19.5 15.5a1.5 1.5 0 1 0 3 0c0-5.523-4.477-10-10-10a9.973 9.973 0 0 0-7.418 3.295L4.735 6.83a1.5 1.5 0 1 0-2.954.52l1.042 5.91c.069.391.29.74.617.968.403.282.934.345 1.385.202l5.644-.996a1.5 1.5 0 1 0-.52-2.954l-2.788.491Z"
            />
            </g>
        </svg>
    )
}

export function BackIcon() {
    return (
        <svg className={ Styles.icon } xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={30} height={30}>
            <title>{"back_2_fill"}</title>
            <g fill="none" fillRule="nonzero">
            <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z" />
            <path
                fill="black"
                d="M7.16 10.972A7 7 0 0 1 19.5 15.5a1.5 1.5 0 1 0 3 0c0-5.523-4.477-10-10-10a9.973 9.973 0 0 0-7.418 3.295L4.735 6.83a1.5 1.5 0 1 0-2.954.52l1.042 5.91c.069.391.29.74.617.968.403.282.934.345 1.385.202l5.644-.996a1.5 1.5 0 1 0-.52-2.954l-2.788.491Z"
            />
            </g>
        </svg>
    )
}

export function AdminRefundSliceComponent({data}) {

    const createdDate = new Date(data.created_at);
    console.log(data);
    // compare date format
    const afterDays = Math.floor((Date.now() - createdDate.getTime())/ (1000 * 60 * 60 * 24));

    return(
        <div>
            <div>
                <h5>{data.refund_id}</h5>
                <p>Requested by {data.ORDERS_T.BUYER.username}</p>
            </div>
            <div>
                Refund Reason:
                <div>{data.refund_subject}</div>
            </div>
            <div className={ Styles.componentBottom}>
                <div>{afterDays} days ago</div>
                <div>
                    <button><Link href={`/admin/ManageRefunds/RefundsTable/${data.refund_id}`}>View</Link></button>
                </div>
            </div>
        </div>
    )
}

export function getdataPath(data, path) {
    return path.split(".").reduce((acc, cur) => acc?.[cur], data);
}