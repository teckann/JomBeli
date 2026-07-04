"use client";

// import { useRouter, useSearchParams } from "next/navigation";
import Styles from './AdminRemarks.module.css';
import {useState} from 'react';
import { handleRefundRemarksChange, handleSupportRemarksChange } from '@/app/_lib/actions';

export default function Adminremarks({remarks, modifyId, isAbleEdit, remarksFor}) {

    let [remarksState, setRemarksState] = useState(remarks);
    let [editState, setEditState] = useState(false);
    
    const handleChange = (e) => {
        setRemarksState(e.target.value);
    }

    const handleClick = () => {
        setEditState(!editState);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (remarksFor === "refund") {
            await handleRefundRemarksChange(new FormData(e.target));
        }
        else {
            await handleSupportRemarksChange(new FormData(e.target));
        }

        setEditState(false);
    };
    

    return(
        <div className={ Styles.adminRemarks}>
            <div>
                <h4>Admin Remarks</h4>
            </div>
            <div className={ Styles.remarksContainer }>
                <form className={ Styles.remarksForm } onSubmit={handleSubmit}>
                    <textarea rows={6} cols={40} name="adminRemarks" onChange={handleChange} className={ Styles.adminRemarksTextArea } value={remarksState ? remarksState : ""} placeholder="Write somethig here." disabled={!editState} />
                    <input type="hidden" value={modifyId} name="modifyId" />
                    <div className={ Styles.buttonParts }>{editState && <button disabled={!isAbleEdit} className={`btn btn-primary ${Styles.green}`} type="submit">Save</button>}</div>
                    <div className={ Styles.buttonParts }>{!editState && <button disabled={!isAbleEdit} className={`btn btn-primary ${Styles.yellow}`} onClick={handleClick} type="button">Edit</button>}</div>
                </form>
                {/* <div className={ Styles.buttonParts }>{!editState && <button disabled={!isAbleEdit} className={`btn btn-primary ${Styles.yellow}`} onClick={handleClick} type="button">Edit</button>}</div> */}
            </div>
        </div>
    )
}