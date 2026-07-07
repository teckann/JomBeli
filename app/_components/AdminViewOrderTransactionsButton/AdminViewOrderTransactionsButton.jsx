'use client';

import { useState } from 'react';
import Styles from "./AVOHB.module.css";
import Modal from '../Modals/Modal';
import AdminTable from '../AdminTable/AdminTable';
import { fetchUserOrders } from '@/app/_lib/actions';
import { fetchUserTransactions } from '@/app/_lib/actions';
import { formatDateTime } from '@/app/_lib/useful-func';

export default function AdminViewOrderHistoryButton({userId}){
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    const orderTitles = ["Order ID", "Seller", "Buyer", "Total Fee", "Order Date", "Status"];
    const orderFields = ["order_id", "seller.username", "buyer.username", "total_amount", "created_at", "order_status"];

    const transactionTitles = ['Transaction Id','Transaction Type', 'Direction', 'Method', 'Amount', 'Status', 'Made At'];
    const transactionFields = ['wallet_transaction_id','transaction_type', 'direction', 'payment_method', 'amount', 'wallet_transaction_status', 'created_at'];

    const handleOpenOrder = async () => {
        setIsOrderModalOpen(true);
        setLoadingOrders(true);
        const data = await fetchUserOrders(userId);
        const formatted = data.map((row) => ({
            ...row,
            created_at: formatDateTime(row.created_at),
        }));
        setOrders(formatted);
        setLoadingOrders(false);
    };

    const handleOpenTransactions = async () => {
        setIsTransactionModalOpen(true);
        setLoadingTransactions(true);
        const data = await fetchUserTransactions(userId);
        const formatted = data.map((row) => ({
            ...row,
            created_at: formatDateTime(row.created_at),
        }));
        setTransactions(formatted);
        setLoadingTransactions(false);
    };

    return (
        <>
            <button className={Styles.openFormBtn} onClick={handleOpenOrder}>
                View order history
            </button>
            <button className={Styles.openFormBtn} onClick={handleOpenTransactions}>
                View transaction history
            </button>

            <Modal
                onClose={() => setIsOrderModalOpen(false)}
                isOpen={isOrderModalOpen}
                title="Order History"
            >
                {loadingOrders ? (
                    <p>Loading...</p>
                ) : orders.length === 0 ? (
                    <p>No orders found for this user.</p>
                ) : (
                    <AdminTable
                        titles={orderTitles}
                        fields={orderFields}
                        datas={orders}
                        slice={true}
                        dataIdFormat="order_id"
                    />
                )}
            </Modal>

            <Modal
                onClose={() => setIsTransactionModalOpen(false)}
                isOpen={isTransactionModalOpen}
                title="Transaction History"
            >
                {loadingTransactions ? (
                    <p>Loading...</p>
                ) : transactions.length === 0 ? (
                    <p>No transactions found for this user.</p>
                ) : (
                    <AdminTable
                        titles={transactionTitles}
                        fields={transactionFields}
                        datas={transactions}
                        slice={true}
                        dataIdFormat="wallet_transaction_id"
                    />
                )}
            </Modal>
        </>
    );
}

