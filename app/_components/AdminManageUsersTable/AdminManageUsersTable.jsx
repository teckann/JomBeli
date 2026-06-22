"use client"

import { getAllUserInfo } from '@/app/_lib/data-services';
import Styles from './AdminManageUsersTable.module.css';
import React, { useState } from 'react';

export default async function UserTable(){

    const users = await getAllUserInfo();

    return (
        <div className="table-container">
            <table>
                <thead className={Styles.tableHeader}>
                    <tr>
                        {/* <th className={Styles.tableHeader}>ID</th> */}
                        <th className={Styles.tableHeaderValue}>Full Name</th>
                        <th className={Styles.tableHeaderValue}>Email</th>
                        <th className={Styles.tableHeaderValue}>Contact Number</th>
                        <th className={Styles.tableHeaderValue}>Role</th>
                        <th className={Styles.tableHeaderValue}>Balances</th>
                        <th className={Styles.tableHeaderValue}>Status</th>
                        <th className={Styles.tableHeaderValue}>Info</th>
                        <th className={Styles.tableHeaderValue}>Action</th>
                    </tr>
                </thead>
                <tbody className={Styles.tableBody}>
                    {users.map((user, key) => {
                        return (
                            <tr key={key}>
                                {/* <td>{user.user_id}</td> */}
                                <td className={Styles.tableData}>{user.username}</td>
                                <td className={Styles.tableData}>{user.email}</td>
                                <td className={Styles.tableData}>{user.contact_number}</td>
                                <td className={Styles.tableData}>{user.role}</td>
                                <td className={Styles.tableData}>{user.balances}</td>
                                <td className={Styles.tableData}>{user.user_status}</td>
                                <td className={Styles.tableData}><button >Info</button></td>
                                <td className={Styles.tableData}><button >Disable</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}