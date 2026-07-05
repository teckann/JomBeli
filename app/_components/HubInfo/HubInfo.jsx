"use client";

import { useState } from "react";
import styles from "./HubInfo.module.css";
import { updateHubInfo, updateHubStatus } from "@/app/_lib/admin-hub-actions";

function HubInfo({
  hubInfo,
  totalCourier,
  totalAvailableCourier,
  totalOccupancy,
}) {
  const {
    hub_id,
    hub_name,
    hub_location,
    capacity: hub_capacity,
    hub_status,
    created_at,
  } = hubInfo;

  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(hub_status);
  const [hubName, setHubName] = useState(hub_name);
  const [location, setLocation] = useState(hub_location);
  const [capacity, setCapacity] = useState(hub_capacity);
  const availableSpace = Number(hub_capacity) - Number(totalOccupancy);

  const originalData = {
    hubName: hub_name,
    location: hub_location || "",
    capacity: hub_capacity || "",
  };

  const handleClose = () => {
    setHubName(originalData.hubName);
    setLocation(originalData.location);
    setCapacity(originalData.capacity);

    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleStatus = async (status) => {
    const newStatus = status === "Active" ? "Inactive" : "Active";

    setStatus(newStatus);
    await updateHubStatus(hub_id, newStatus);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    await updateHubInfo(formData);

    setIsOpen(false);
  };

  let storagePercentage = (totalOccupancy / hub_capacity) * 100;

  const getProgressColor = (percentage) => {
    if (percentage <= 70) return "#22c55e";
    if (percentage <= 85) return "#f59e0b";
    return "#ef4444";
  };

  const getStorageLevel = (percentage) => {
    if (percentage <= 70) return "Low";
    if (percentage <= 85) return "Medium";
    return "High";
  };

  const getStorageCondition = (percentage) => {
    if (percentage <= 70)
      return "The hub is operating normally with sufficient storage capacity.";

    if (percentage <= 85)
      return "The hub is approaching its storage capacity. Monitor incoming shipments closely.";

    return "The hub is nearing full capacity. Immediate action is recommended to prevent congestion.";
  };

  return (
    <div className={styles.main}>
      <div className={styles.hubProfileTitle}>
        <div className={styles.title}>
          <h1>{hubInfo.hub_name} Details</h1>
          <p className={styles.subtitle}>View and manage selected hub here</p>
        </div>

        <div className={styles.actions}>
          <button
            onClick={() => handleStatus(status)}
            className={styles.actionButton}
          >
            {status === "Active" ? "Inactive" : "Active"} Now
          </button>

          <button
            onClick={isOpen ? handleClose : handleOpen}
            className={styles.actionButton}
          >
            {isOpen ? "Close" : "Edit"}
          </button>
        </div>
      </div>

      <div className={styles.hubInfoDetails}>
        <form onSubmit={handleSubmit} className={styles.hubInfo}>
          <input type="hidden" name="hubId" value={hub_id} />

          <div className={styles.row}>
            <div className={styles.data}>
              <label>Hub ID</label>
              <input type="text" value={hub_id} disabled={true} />
            </div>

            <div className={styles.data}>
              <label>Hub Name</label>
              <input
                name="hubName"
                type="text"
                value={hubName}
                onChange={(e) => setHubName(e.target.value)}
                disabled={!isOpen}
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.data}>
              <label>Location</label>
              <textarea
                name="hubLocation"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={!isOpen}
                required
              />
            </div>

            <div className={styles.data}>
              <label>Hub Capacity</label>
              <input
                name="hubCapacity"
                type="number"
                min={0}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                disabled={!isOpen}
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.data}>
              <label>Created Date</label>
              <input
                type="text"
                value={formatDateTime(created_at)}
                disabled={true}
              />
            </div>

            <div className={styles.data}>
              <label>Hub Status</label>
              <input
                type="text"
                value={hub_status}
                disabled={true}
                className={
                  hub_status === "Active" ? styles.active : styles.inactive
                }
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.data}>
              <label>Total Courier Man</label>
              <input type="text" value={totalCourier} disabled={true} />
            </div>

            <div className={styles.data}>
              <label>Total Available Courier Man</label>
              <input
                type="text"
                value={totalAvailableCourier}
                disabled={true}
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.saveButton}
            disabled={!isOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className={styles.icon}
            >
              <path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zM7 5h8v4H7V5zm0 14v-6h10v6H7z" />
            </svg>

            <p>Save Changes</p>
          </button>
        </form>

        <div className={styles.hubStorage}>
          <p className={styles.hubStorageTitle}>Hub Storage</p>

          <div className={styles.hubStorageInfo}>
            <div className={styles.row}>
              <div className={styles.data}>
                <label>Current Occupancy</label>
                <input type="text" value={totalOccupancy} disabled={true} />
              </div>

              <div className={styles.data}>
                <label>Total Capacity</label>
                <input type="text" value={hub_capacity} disabled={true} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.data}>
                <label>Available Space</label>
                <input type="text" value={availableSpace} disabled={true} />
              </div>

              <div className={styles.data}>
                <label>Storage Level</label>
                <input
                  type="text"
                  value={getStorageLevel(storagePercentage)}
                  disabled={true}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={`${styles.data} ${styles.storageData}`}>
                <label>Storage Utilization</label>

                <div className={styles.progressBar}>
                  <div
                    className={styles.progress}
                    style={{
                      width: `${storagePercentage}%`,
                      backgroundColor: getProgressColor(storagePercentage),
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.row}>
              <div className={`${styles.data} ${styles.storageData}`}>
                <label>Storage Condition</label>
                <input
                  type="text"
                  value={getStorageCondition(storagePercentage)}
                  disabled={true}
                  className={styles.storageCondition}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const formatDateTime = (datetime) => {
  const date = new Date(datetime);
  return `${date.toLocaleDateString("en-CA")} ${date.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    },
  )}`;
};

export default HubInfo;
