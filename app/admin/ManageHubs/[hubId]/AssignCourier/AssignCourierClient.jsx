"use client";

import { useState } from 'react';
import AdminTable from '@/app/_components/AdminTable/AdminTable';
import Styles from './AssignCourier.module.css';
import { adminAssignCourier, updateCourierStatus } from '@/app/_lib/actions';
import { useRouter } from 'next/navigation';
// import { getUser } from '@/app/_lib/auth';

export default function AssignCourierClient({datas, fields, titles, actions, couriers, user}) {

    let [deliveryList, setDeliveryList] = useState([]);
    let [selectedCourierId, setSelectedCourierId] = useState(null);
    const router = useRouter();

    const handleClickDelivery = (e) => {
        const id = Number(e.target.value);

        setDeliveryList((prev) =>
        e.target.checked
            ? [...prev, id]
            : prev.filter((item) => item !== id)
        );
    };

    const isAble = deliveryList.length > 0 && selectedCourierId !== null;

    const handleSelectCourier = (courierId) => {
        if (courierId !== null) {
            setSelectedCourierId(courierId);
        }
    }

    const handleAssign = async () => {
        deliveryList.forEach(async (id)=>{
            const orderId = datas.find( data => data.shipping_id === id)?.order_id;
            console.log(orderId);
            await adminAssignCourier(user.id, id, selectedCourierId, orderId)
        })

        await updateCourierStatus(selectedCourierId);
        setDeliveryList([]);
        setSelectedCourierId(null);

        router.refresh();
    }

    return (
        <div>
            <div>
                <AdminTable handleClickDelivery={handleClickDelivery} titles={titles} deliveryList={deliveryList} fields={fields} datas={datas} slice={false} actions={actions} dataIdFormat="refund_id"  />
            </div>
            <div>
                <h3>Pick One Courier Man</h3>
                <div className={ Styles.courierShow }>
                    {couriers.map((courier, index) => { 
                        const provideId = courier.available_status ? courier.user_id : null;
                        return <div key={index} onClick={() => handleSelectCourier(provideId)} className={` ${Styles.courierComponent} ${selectedCourierId === courier.user_id ? Styles.activeCourier : ""} `}>
                            <div className={ Styles.courierUpper}>
                                <div>
                                    <b>{courier.username}</b><br /> <small>{courier.user_id}</small>
                                </div>
                                <div className={courier.available_status? Styles.greenStatus : Styles.redStatus}>
                                    {courier.available_status ? "Available" : "Unavailable"}
                                </div>
                            </div>
                            <div className={ Styles.courierBottom }>
                                <div>
                                    <p>
                                        Current Parcel:
                                    </p>
                                    <h3>{courier.total_shipping}</h3>
                                </div>
                                <div>
                                    <p>
                                        Hub:
                                    </p>
                                    <h3>{courier.hub_name}</h3>
                                </div>
                            </div>
                        </div> }
                    )}
                </div>
            </div>
            <div>
            <button 
                disabled={!isAble} 
                className={ Styles.assignButton }
                onClick={()=>{handleAssign()}}
            >
                Assign
            </button>
            </div>
        </div>
    )
}