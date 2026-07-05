'use client';

import Styles from './AdminFilterUsers.module.css';
import { AdminAddCourierForm, AdminAddAdminForm } from '../AdminAddUsers/AdminAddUsersWidget';
import { useRouter, useSearchParams } from 'next/navigation';

export function FilterUser({role}){

    const router = useRouter();
    const searchParams = useSearchParams();

    const currentUserRole = searchParams.get("role") || "All";
    const currentUserStatus = searchParams.get("status") || "Active";
    const currentUsername = searchParams.get("username") || "";

    const handleChange = (e) => {
        //make a new copy to edit without touching the original
        const params = new URLSearchParams(searchParams.toString());
        //.set() adds the changed name and value user picked 
        params.set(e.target.name, e.target.value);
        //.toString() serializes back to a query string 
        router.push(`?${params.toString()}`);
    } 

    return(
        <div className={Styles.filterBar}>
            <div className={Styles.searchUser}>
                <SearchUser values={currentUsername} handleChange={handleChange}/>  
            </div>
            <div className={Styles.roleAndStatus}>
                <SelectRole values={currentUserRole} handleChange={handleChange} role={role}/>
                <SelectStatus values={currentUserStatus} handleChange={handleChange}/>
            </div>
        </div>
    )

}

export function FilterCourier({ hubs }){

    const router = useRouter();
    const searchParams = useSearchParams();

    const currentUserStatus = searchParams.get("status") || "All";
    const currentUsername = searchParams.get("username") || "";

    const handleChange = (e) => {
        //make a new copy to edit without touching the original
        const params = new URLSearchParams(searchParams.toString());
        //.set() adds the changed name and value user picked 
        params.set(e.target.name, e.target.value);
        //.toString() serializes back to a query string 
        router.push(`?${params.toString()}`);
    } 

    return(
        <div className={Styles.filterBar}>
            <div className={Styles.searchUser}>
                <SearchUser values={currentUsername} handleChange={handleChange}/>  
                <AdminAddCourierForm hubs={hubs} />
            </div>
            <div className={Styles.roleAndStatus}>
                <SelectStatus values={currentUserStatus }handleChange={handleChange}/>
            </div>
        </div>
    )

}

export function FilterAdmin(){

    const router = useRouter();
    const searchParams = useSearchParams();

    const currentUserStatus = searchParams.get("status") || "Active";
    const currentUsername = searchParams.get("username") || "";

    const handleChange = (e) => {
        //make a new copy to edit without touching the original
        const params = new URLSearchParams(searchParams.toString());
        //.set() adds the changed name and value user picked 
        params.set(e.target.name, e.target.value);
        //.toString() serializes back to a query string 
        router.push(`?${params.toString()}`);
    } 

    return(
        <div className={Styles.filterBar}>
            <div className={Styles.searchUser}>
                <SearchUser values={currentUsername} handleChange={handleChange}/>  
                <AdminAddAdminForm />
            </div>
            <div className={Styles.roleAndStatus}>
                <SelectStatus values={currentUserStatus }handleChange={handleChange}/>
            </div>
        </div>
    )

}

export function SearchUser({ handleChange }){
    return(
        <div>
            <input name="username" className={Styles.searchUserBar} onChange={handleChange} placeholder="Search User by name" type="text"></input>
        </div>
    )
}

export function SelectRole({ role,handleChange,values }){
    return(
        <div>
            <label className={Styles.selectText} htmlFor='role'/>
            <select name="role" id="role" className={Styles.roleDropdown} onChange={handleChange} value={values}>
                <option value="All">All</option>
                {role.map((roles) => {
                    return <option key={roles} value={roles}>{roles}</option>  
                })}
            </select>
        </div>
    )
}

export function SelectStatus({handleChange,values}){
    return (
        <div>
            <label className={Styles.selectText} htmlFor='status'/>
            <select name="status" id="status" className={Styles.statusDropdown} onChange={handleChange} value={values}>
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
            </select>
        </div>
    )
}