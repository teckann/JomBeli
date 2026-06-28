"use client";

import Styles from './AdminGenerateProductReport.module.css';
import { redirectMonthlyReport } from '@/app/_lib/actions';
import { useState } from 'react';

export default function GenrateReportButton({yearMonths}) {

    let [expand, setExpand] = useState(false);

    const handleClick = () => {
        setExpand(!expand);
    }

    return (
        <div>
            {!expand ? <GenerateReportButton handleClick={() => handleClick()} /> :
            <ExpandedGenerateReport handleClick={() => handleClick()} yearMonths={yearMonths} />    }
        </div>
    )
}

export function GenerateReportButton({handleClick}) {
    return (
        <button className="btn btn-primary" onClick={() => handleClick()}>
            Generate Product Report
        </button>
    );
}

export function ExpandedGenerateReport({handleClick, yearMonths}) {

    let [monthList, setMonthList] = useState(yearMonths[0].months);

    const monthIndexs = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const findMonthList = (event) => {
        const selectedYear = Number(event.target.value);
        const monthList = yearMonths.find((each) => each.year === selectedYear).months;
        setMonthList(monthList);
    }

    return(
        <div className={ Styles.complete }>
            <div>
                <h4 className={ Styles.productReportText }>Product Report Generate Form</h4>
            </div>
            <div className={ Styles.inputsContainer }>
                <button className={ `${Styles.backButton} btn btn-primary` } onClick={() => handleClick()}>
                    Cancel
                </button>
                <form className={ Styles.form } action={redirectMonthlyReport}>
                    <div className={ Styles.eachInputs }>
                        <label htmlFor="reportYearSelect">Year:</label>
                        <select className={ Styles.selectBox } name="reportYearSelect" id="reportYearSelect" onChange={findMonthList}>
                            {yearMonths.map((eachYear) => {
                                return <option key={eachYear.year} value={eachYear.year}>{eachYear.year}</option>
                            })}
                        </select>
                    </div>
                    <div className={ Styles.eachInputs }>
                        <label htmlFor="reportMonthSelect">Month:</label>
                        <select className={ Styles.selectBox } name="reportMonthSelect" id="reportMonthSelect">
                            {monthList.map((eachMonth) => {
                                return <option key={eachMonth} value={eachMonth}>{monthIndexs[eachMonth]}</option>
                            })}
                        </select>
                    </div>
                    <button className={` ${Styles.generateButton} btn btn-primary`} type="submit">
                            Generate Monthly Report
                    </button>
                </form>
            </div>
        </div>
    )
}