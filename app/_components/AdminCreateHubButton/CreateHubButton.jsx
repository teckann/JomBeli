"use client";

import { useState } from 'react';
import Styles from './CreateHubButton.module.css';
import { createHubAction } from '@/app/_lib/actions';
import { useRouter } from 'next/navigation';

export default function createHubButton() {

    const router = useRouter();

    let [isOverlay, setIsOverlay] = useState(false);
    let [hubName, setHubName] = useState("");
    let [hubLocation, setHubLocation] = useState("");
    let [capacity, setCapacity] = useState("");
    let [isChecked, setIsChecked] = useState(false);

    const handleClick = () => {
        setIsOverlay(!isOverlay);
    }

    const handleHubNameChange = (e) => {
        setHubName(e.target.value);
    }
    const handleHubLocationChange = (e) => {
        setHubLocation(e.target.value);
    }
    const handleHubCapacityChange = (e) => {
        setCapacity(e.target.value);
    }

    const handleChekInput = () => {
        setIsChecked(!isChecked);
    }

    const handleSubmitCreate = async () => {
        await createHubAction(hubName, hubLocation, capacity);
        router.refresh();
        setIsOverlay(false);
    }

    const isAble = (hubName.length > 0 && hubLocation.length > 0 && Number(capacity) > 0 && isChecked === true);

    return(
        <div>
            <button className={ Styles.openButton } onClick={handleClick}>Create Hub</button>

            {isOverlay && 
            <Overlay handleAction={handleClick} hubName={hubName} hubLocation={hubLocation} capacity={capacity} isChecked={isChecked} 
            handleHubNameChange={handleHubNameChange} handleHubLocationChange={handleHubLocationChange} handleHubCapacityChange={handleHubCapacityChange}
            handleChekInput={handleChekInput} isAble={isAble} handleCreate={handleSubmitCreate} />}
        </div>
    )
}

export function Overlay({handleAction, hubName, hubLocation, capacity, handleHubNameChange, handleHubLocationChange, handleHubCapacityChange, handleChekInput, isAble, handleCreate}) {

    return (
        <div>
            <div onClick={handleAction} className={ Styles.overlay }>

            </div>
            <div className={ Styles.component }>
                <div className={ Styles.componentUp }>
                    <button className={ Styles.openButton } onClick={handleAction}>X</button>
                    <div className={ Styles.componentTitle }><h3>Add New Hub</h3></div>
                </div>
                <div className={ Styles.createForm }>
                    <div className={ Styles.inputChange}>
                        <label htmlFor="hubNameInput"><b>Hub Name</b></label>
                        <input className={ Styles.input } id="hubNameInput" name="hubNameInput" onChange={handleHubNameChange} type="text" required value={hubName} placeholder="New Huub Name" />
                    </div>
                    <div className={ Styles.inputChange}>
                        <label htmlFor="hubLocationInput"><b>Hub Location</b></label>
                        <textarea className={ Styles.locationInput } id="hubLocationInput" name="hubLocationInput" cols={30} rows={6} onChange={handleHubLocationChange} required value={hubLocation} placeholder="Insert new hub name here" />
                    </div>
                    <div className={ Styles.inputChange}>
                        <label htmlFor="hubCapacityInput"><b>Hub Capaity</b></label>
                        <input className={ Styles.input } min="0" id="hubCapacityInput" type="number" name="hubCapacityInput" onChange={handleHubCapacityChange} required value={capacity} />
                    </div>
                    <div className={ Styles.checkBoxChange}>
                        <input id="hubCheckBox" className={ Styles.checkBox } type="checkbox" name="hubCheckBox" onClick={handleChekInput} />
                        <label htmlFor="hubCheckBox" className={ Styles.checkBox }>I understand that once a hub is created, it cannot be deleted. It can only be deactivated.</label>
                    </div>
                    <button disabled={!isAble} className={ Styles.confirmButton } onClick={handleCreate}><b>Confirm</b></button>
                </div>
            </div>
        </div>
    )
}