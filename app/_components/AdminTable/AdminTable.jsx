"use client";

import Styles from './AdminTable.module.css';

export default function AdminTable({titles, actions, datas}) {

    console.log(datas);

    // action = [{}, {}]
    // if contain action, just add one more row
    const finalTitles = actions ? [...titles, "Action"] : titles;

    const totalColumns = titles.length;

    return (
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
                        datas.map((data) =>
                            // <tr key={data}>                             
                            // </tr>
                            // {console.log(data);}
                            <InsertData key={data} data={data} actions={actions} />
                        )
                    }
            </tbody>
        </table>
    );
    
}

export function InsertData({data, actions}) {


    return(
        <tr>
            {data.map((each) => 
                <td key={each}>{each}</td>
            )}
            {
                actions.map((action) => {
                    
                })
            }
        </tr>
    )
}

export function DeactiveIcon() {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={ Styles.icons }>
            <path fill="currentColor" d="M205.204 203.44A107.941 107.941 0 0 0 52.565 50.793a11.936 11.936 0 0 0-1.772 1.772A107.94 107.94 0 0 0 203.44 205.203a12.09 12.09 0 0 0 .928-.835 12.29 12.29 0 0 0 .836-.928Zm6.797-75.44a83.56 83.56 0 0 1-16.751 50.279L77.722 60.75a83.958 83.958 0 0 1 134.279 67.25Zm-168 0a83.56 83.56 0 0 1 16.75-50.278L178.28 195.25A83.958 83.958 0 0 1 44.001 128Z" />
        </svg>
    );
}

export function ActivateIcon() {
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
            <title>{"open-external"}</title>
            <path
            fill="currentColor"
            fillRule="evenodd"
            d="M213.333 128v42.666H128V384h213.333v-85.334H384l.001 128H85.333V128h128ZM448 64v170.667h-42.667v-97.832L228.418 313.752l-30.17-30.17 176.915-176.916h-97.83V64H448Z"
            />
        </svg>
    );
}

