"use client";

import { useState } from 'react';
import Styles from "./AdminSliceShow.module.css";
import Link from 'next/link'

export default function AdminSliceShow({datas, purpose}) {

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
        <div className={ Styles.sliceContainer }>
            {expandable && <div className={ Styles.navContainer }>
                <button className={ `${!expandable && Styles.hide} ${Styles.button}` } onClick={handleDeduct}>
                    <BackIcon />
                </button>
            </div> }
            {purpose ==="refund" && 
            <div className={ Styles.componentFrame }>
                {datasSliced.map((data, index) => 
                    <AdminRefundSliceComponent key={index} data={data} />
                )}
            </div> }

            {purpose === "reportProduct" && 
            <div className={ Styles.componentFrame }>
                {datasSliced.map((data, index) => 
                    <AdminSystemSupportSliceComponent key={index} data={data} purpose={purpose} reportItemName={data.targetProduct.product_name} />
                )}
            </div> }
            {purpose === "reportSeller" && 
            <div className={ Styles.componentFrame }>
                {datasSliced.map((data, index) => 
                    <AdminSystemSupportSliceComponent key={index} data={data} purpose={purpose} reportItemName={data.targetSeller.username} />
                )}
            </div> }
            {purpose === "reportGeneral" && 
            <div className={ Styles.componentFrame }>
                {datasSliced.map((data, index) => 
                    <AdminSystemSupportSliceComponent key={index} data={data} purpose={purpose} reportItemName={data.support_type} />
                )}
            </div> }

            <div className={ Styles.navContainer }>
                <button className={ `${!expandable && Styles.hide} ${Styles.button}` } onClick={handleAdd}>
                    <NextIcon />
                </button>
            </div>
        </div>
    )
}

export function NextIcon() {
    return (
        <svg className={ `${Styles.revert}` }
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width={30} height={30}
        >
            <path
            fill="currentColor"
            d="m4 10-.707.707L2.586 10l.707-.707L4 10Zm17 8a1 1 0 1 1-2 0h2ZM8.293 15.707l-5-5 1.414-1.414 5 5-1.414 1.414Zm-5-6.414 5-5 1.414 1.414-5 5-1.414-1.414ZM4 9h10v2H4V9Zm17 7v2h-2v-2h2Zm-7-7a7 7 0 0 1 7 7h-2a5 5 0 0 0-5-5V9Z"
            />
        </svg>
    )
}

export function BackIcon() {
    return (
        <svg className={ `${Styles.icon}` }
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width={30} height={30}
        >
            <path
            fill="currentColor"
            d="m4 10-.707.707L2.586 10l.707-.707L4 10Zm17 8a1 1 0 1 1-2 0h2ZM8.293 15.707l-5-5 1.414-1.414 5 5-1.414 1.414Zm-5-6.414 5-5 1.414 1.414-5 5-1.414-1.414ZM4 9h10v2H4V9Zm17 7v2h-2v-2h2Zm-7-7a7 7 0 0 1 7 7h-2a5 5 0 0 0-5-5V9Z"
            />
        </svg>
    )
}

export function AdminRefundSliceComponent({data}) {

    const createdDate = new Date(data.created_at);
    // compare date format
    const afterDays = Math.floor((Date.now() - createdDate.getTime())/ (1000 * 60 * 60 * 24));

    return(
        <div className={ Styles.sliceComponent }>
            <div className={ Styles.sliceTitle }>
                <h5 className={ Styles.titleText }>Refund ID: {data.refund_id}</h5>
                <p>Requested by {data.ORDERS_T.BUYER.username}</p>
            </div>
            <div>
                <small>Refund Reason:</small>
                <div className={ Styles.refundReason }>{data.refund_subject}</div>
            </div>
            <div className={ Styles.componentBottom}>
                <div className={ Styles.daysText }><i>{afterDays} days ago</i></div>
                <div className={ Styles.buttonContainer }>
                    <button className="btn btn-primary"><Link className={ Styles.linkText } title="view refund details" href={`/admin/ManageRefunds/RefundsTable/${data.refund_id}`}>View</Link></button>
                </div>
            </div>
        </div>
    )
}

export function getdataPath(data, path) {
    return path.split(".").reduce((acc, cur) => acc?.[cur], data);
}


export function AdminSystemSupportSliceComponent({data, purpose, reportItemName}) {

    let navLink = "";
    let reportTitle = "";
    if (purpose === "reportProduct") {
        reportTitle = "Reported Product"
        // navLink = `/admin/ManageSystemSupport/${data.target_product_id}`;
    } else if (purpose === "reportSeller") {
        reportTitle = "Reported Seller"
        // navLink = `/admin/ManageSystemSupport/${data.target_seller_id}`;
    } else if (purpose === "reportGeneral") {
        reportTitle = "Report Title"
        // navLink = `/admin/ManageSystemSupport/${data.support_id}`;
    }

    const createdDate = new Date(data.created_at);
    // compare date format
    const afterDays = Math.floor((Date.now() - createdDate.getTime())/ (1000 * 60 * 60 * 24));

    return(
        <div className={ Styles.sliceComponent }>
            <div className={ Styles.sliceTitle }>
                <h5 className={ Styles.titleText }>Support ID: {data.support_id}</h5>
                <p>Requested by {data.reporter.username}</p>
            </div>
            <div>
                <small>{reportTitle}:</small>
                <div className={ Styles.refundReason }>{reportItemName}</div>
            </div>
            <div className={ Styles.componentBottom}>
                <div className={ Styles.daysText }><i>{afterDays} days ago</i></div>
                <div className={ Styles.buttonContainer }>
                    <button className="btn btn-primary"><Link className={ Styles.linkText } title="view report details" href={`/admin/ManageSystemSupport/SupportTable/${data.support_id}`}>View</Link></button>
                </div>
            </div>
        </div>
    )
}