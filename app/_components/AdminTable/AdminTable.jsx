"use client";

import Styles from './AdminTable.module.css';
import { useRouter } from "next/navigation";
import { useState } from 'react';

export default function AdminTable({titles, actions, fields, datas, dataIdFormat, slice}) {

    const router = useRouter();

    // name = title name, icon = icon function, handler = handle action, show = precondition for show
    // define icon and actions
    // under {}, object are iterable (kkep object properties), [] only iterable for array
    const actionMaps = {viewProduct: {name: "View", icon: <InfoIcon />, handler: (product) => router.push(`/admin/ManageProducts/${getdataPath(product, "product_id")}`), show: (product) => true},
                        viewUsers: {name: "View", icon: <InfoIcon />, handler: (user) => router.push(`/admin/ManageUsers/${getdataPath(user, "user_id")}`), show: (data) => true},
                    viewReviewer: {name: "View Reviewer", icon: <InfoIcon />, handler: (review) => router.push(`/admin/ManageUsers/${getdataPath(review, "user_id")}`), show: (review) => true},
                viewRefund: {name: "View Refund", icon: <InfoIcon />, handler: (refund) => router.push(`/admin/ManageRefunds/RefundsTable/${getdataPath(refund, "refund_id")}`), show: (refund) => true}};

    // console.log(datas);

    // action = [{}, {}]
    // if contain action, just add one more row
    const finalTitles = actions ? [...titles, "Action"] : titles;

    let [pageCounter, setPageCounter] = useState(1);

    const maxRowsForTable = 5;

    const maxPages = Math.ceil(datas.length / maxRowsForTable);

    const startSlicePoint = (pageCounter - 1) * maxRowsForTable;
    const endSlicePoint = startSlicePoint + maxRowsForTable;

    // set the copy of slice array
    const datasSliced = datas.slice(startSlicePoint, endSlicePoint);

    const handleFirstPageCounter = () => {
        setPageCounter(1);
    }
    
    const handleDeductPageCounter = () => {
        if (pageCounter > 1) {
            setPageCounter(pageCounter - 1);
        }
    }
    const handlePlusPageCounter = () => {
        if (pageCounter < maxPages) {
            setPageCounter(pageCounter + 1);
        }
    }

    const handleEndPageCounter = () => {
        setPageCounter(maxPages);
    }

    let counter = 0;

    // if (datas.length === 0) {
    //     return <div className={ Styles.noDataContainer }>
    //         <h3>The table is empty</h3>
    //     </div>
    // }

    return (
        <div className={ Styles.overallTable}>
            <div className={ Styles.tableWrapper }>
                <table className={ Styles.tableFrame }>
                    <thead className={ Styles.tableHeading}>
                        <tr className={ Styles.tableTitles }>
                            {finalTitles.map((title) =>  
                                <th className={ Styles.columnTitle } key={title}>{title}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (!slice ? datas.map((data, index) => {
                                    counter++;
                                    const evenRows = (counter % 2 == 0 ? true : false);
                                    return <InsertData key={index} evenRows={evenRows} fields={fields} data={data} actions={actions} actionMaps={actionMaps} />
                                }) :
                                datasSliced.map((data, index) => {
                                    counter++;
                                    const evenRows = (counter % 2 == 0 ? true : false);
                                    return <InsertData key={index} evenRows={evenRows} fields={fields} data={data} actions={actions} actionMaps={actionMaps} />
                                }
                            )
                            )
                        }
                            {/* {
                                datasSliced.map((data) => {
                                    counter++;
                                    const evenRows = (counter % 2 == 0 ? true : false);
                                    return <InsertData key={getdataPath(data, dataIdFormat)} evenRows={evenRows} fields={fields} data={data} actions={actions} actionMaps={actionMaps} />
                                }
                                )
                            } */}
                    </tbody>
                </table>
            </div>
            {(datas.length !== 0 && slice) && 
                <div className={ Styles.showPageTextContainer }>
                    <span className={ Styles.showPageText }>
                        <button className="btn btn-primary" onClick={() => handleFirstPageCounter()}>{"<<"}</button>
                        <button className="btn btn-primary" onClick={() => handleDeductPageCounter()}>-</button>
                        <span>page <span className={ Styles.pageCounterText }>{pageCounter}</span> of {maxPages}</span>
                        <button className="btn btn-primary" onClick={() => handlePlusPageCounter()}>+</button>
                        <button className="btn btn-primary" onClick={() => handleEndPageCounter()}>{">>"}</button>
                    </span>
                </div>
            }
        </div>
    );
    
}

export function InsertData({evenRows, fields, data, actions, actionMaps}) {

    // let counter = 0;

    return(
        <tr className={ `${Styles.dataRow} ${evenRows ? Styles.evenRows : ""}`}>
            {fields.map((field) => 
                <td align="center" key={field} className={ Styles.dataShow }>{getdataPath(data, field)}</td>
            )}
            {
                actions &&
                    <td className={Styles.dataShow}>
                        {
                            actions.map((action) => {
                                // console.log(action.type);
                                const actionConfig = actionMaps[action.type];

                                return (actionConfig.show(data) &&
                                <button key={actionConfig.name} className={Styles.actionButton} title={actionConfig.name} onClick={() => actionMaps[action.type].handler(data)}>
                                    {actionConfig.icon}
                                </button>
                            )
                            })
                        }
                    </td>                
            }
        </tr>
    )
}

// convert the path pass from fields (string into valid format)
export function getdataPath(data, path) {
    return path.split(".").reduce((acc, cur) => acc?.[cur], data);
}

export function DeactiveIcon() {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={ Styles.icons }>
            <path fill="currentColor" d="M205.204 203.44A107.941 107.941 0 0 0 52.565 50.793a11.936 11.936 0 0 0-1.772 1.772A107.94 107.94 0 0 0 203.44 205.203a12.09 12.09 0 0 0 .928-.835 12.29 12.29 0 0 0 .836-.928Zm6.797-75.44a83.56 83.56 0 0 1-16.751 50.279L77.722 60.75a83.958 83.958 0 0 1 134.279 67.25Zm-168 0a83.56 83.56 0 0 1 16.75-50.278L178.28 195.25A83.958 83.958 0 0 1 44.001 128Z" />
        </svg>
    );
}

export function ReactiveIcon() {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={ Styles.icons }>
            <path fill="none" d="M0 0h48v48H0z" />
            <path fill="currentColor" d="M10 22v2c0 7.72 6.28 14 14 14s14-6.28 14-14-6.28-14-14-14h-4V4l-8 8 8 8v-6h4c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10v-2h-4z" />
        </svg>
    );
}

export function InfoIcon() {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={ Styles.icons }>
            <path
            fill="currentColor"
            fillRule="evenodd"
            d="M213.333 128v42.666H128V384h213.333v-85.334H384l.001 128H85.333V128h128ZM448 64v170.667h-42.667v-97.832L228.418 313.752l-30.17-30.17 176.915-176.916h-97.83V64H448Z"
            />
        </svg>
    );
}

