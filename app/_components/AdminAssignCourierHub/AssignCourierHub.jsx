'use client';

import Styles from "./AssignCourierHub.module.css";
import {useState} from 'react';
import { assignHubToCourier } from "@/app/_lib/actions";

export default function AssignHub({userId, currentHubId, hubs, disabled}){
    const [selectedHub, setSelectedHub] = useState(currentHubId ?? "");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = async (e) => {
        const newHubId = e.target.value;
        setSelectedHub(newHubId);
        setSaving(true);
        setMessage("");

        const result = await assignHubToCourier(userId, newHubId);

        if (result.success) {
            setSelectedHub(newHubId)
            setMessage("Hub updated successfully");
        } else {
            setMessage(result.error || "Failed to update hub")
        }
        setSaving(false);
    }

    return (
        <div className={Styles.assignHubContainer}>
            <div className={Styles.headerWrapper}>
                <h3 className={Styles.sectionTitle}>Assign Hub</h3>
            </div>
            <div className={Styles.container}>
                <label htmlFor="hubSelect" className={Styles.label}>Change Assigned Hub</label>
                <select
                    id="hubSelect"
                    value={selectedHub}
                    onChange={handleChange}
                    disabled={saving || disabled}
                    className={Styles.dropdown}
                >
                    {hubs.map((hub) => (
                        <option key={hub.hub_id} value={hub.hub_id}>{hub.hub_name ?? "no hub assigned"}</option>
                    ))}
                </select>
                {saving && <span className={Styles.statusText}>Saving...</span>}
                {message && <span className={Styles.statusText}>{message}</span>}
                {disabled && !saving && (
                    <span className={Styles.statusText}>
                        Cannot reassign hub when a delivery is pending.
                    </span>
                )}
            </div>
        </div>
    );
}