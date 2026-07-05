'use client'

import React, { useState, useRef } from 'react'
import styles from './SellerProfile.module.css';

import SignOutButton from '../SignOutButton';
import ThemeToggleButton from "../ThemeToggleButton";

import { updateUserData,uploadAvatar } from "@/app/_lib/actions";
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const SellerProfile = ({ userInfo }) => {


    
    const [isEditing, setisEditing] = useState(false);
    const [toSave, setToSave] = useState(false);

    const [avatarChange, setAvatarChange] = useState(false);
    const fileInput = useRef(null);

    
    const [userData, setUserData] = useState({
        username: userInfo.username,
        gender: userInfo.gender,
        email: userInfo.email,
        contact_number: userInfo.contact_number,
        user_id: userInfo.user_id,
        avatar: userInfo.avatar
    });

    function changeState (e) {
        const { name, value } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    async function saveChange() {
        setToSave(true);

        await updateUserData(userData.user_id, userData);



        setisEditing(false);

        setAvatarChange(null);
    }

    const changeAvatar = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarChange(file);

            const formData = new FormData();
            
            formData.append('file', file);

            const newAvatarUrl = await uploadAvatar(formData);

            const newData = {
                username: userData.username,
                gender: userData.gender,
                email: userData.email,
                contact_number: userData.contact_number,
                avatar: newAvatarUrl
            };

            await updateUserData(userInfo.user_id, newData);

            setUserData(prev => ({
                ...prev,
                avatar: newAvatarUrl
            }));





        }
    };

    const copyId = () => {
        navigator.clipboard.writeText(userData.user_id);
    };





  return (
    <div className={styles.fcon}>

        <h1 className={styles.title}>Profile</h1>

        <div className={styles.scon}>

            <div className={styles.left}>

                <div className={styles.avatarCon}>

                    <div className={styles.avatarCircle}>

                        <img className={styles.avatarPic} src={userData.avatar} alt="Profile" />

                        <input 
                            type="file" 
                            accept="image/*" 
                            style={{ display: 'none' }} 
                            ref={fileInput} 
                            onChange={changeAvatar} 
                        />

                        <button className={styles.editAvatar}
                            onClick={() => fileInput.current.click()}
                            >
                                    ✒️<span className={styles.avaSpan}> Edit</span>
                        </button>

                    </div>

                    <div className={styles.idCon}>
                            <button className={styles.copy}
                                onClick={copyId}>
                                ⧉ User ID :

                            </button>
                            
                        <p className={styles.userId}>{userInfo.user_id}</p>

                    </div>

                </div>

                <div className={styles.right}>
                    <div className={styles.rightCon}>

                        <div className={styles.row}>
                            <label>Name</label>
                            {isEditing ? (
                                <input 
                                    type="text"
                                    name='username'
                                    required
                                    value={userData.username}
                                    onChange={changeState}
                                    className={styles.input}  />
                            ) : (
                                <p>{userData.username}</p>
                            )}


                        </div>

                        <div className={styles.row}>
                            <label >Gender</label>
                            {isEditing ? (
                                <input 
                                    type='text'
                                    name='gender'
                                    value={userData.gender}
                                    onChange={changeState}
                                    className={styles.input}/>
                            ) : (
                                <p>{userData.gender}</p>
                            )}

                        </div>

                        <div className={styles.row}>
                            <label>Email</label>
                            {isEditing ? (
                                <input 
                                    type="email"
                                    name='email'
                                    required
                                    value={userData.email}
                                    onChange={changeState}
                                    className={styles.input}/>
                            ) : (
                                <p>{userData.email}</p>
                            )}

                        </div>

                        <div className={styles.row}>
                            <label>Contact</label>
                            {isEditing ? (
                                <input 
                                    type="text"
                                    name='contact_number'
                                    value={userData.contact_number}
                                    onChange={changeState}
                                    className={styles.input} />
                            ) : (
                                <p>{userData.contact_number}</p>
                            )}

                        </div>

                    </div>

                    {!isEditing && (
                        <div className={styles.themeCon}>
                            <h2>Theme</h2>
                            <div className={styles.themeBtn}>
                                <ThemeToggle />
                            </div>

                        </div>
                    )}

                </div>



            </div>

            <div className={styles.actionCon}>
                {!isEditing ? (
                    <>
                        <div className={styles.leftAct}>
                            <SignOutButton />        

                        </div>
                        <div className={styles.rightAct}>
                            <button className={styles.btn}>Account Security</button>
                            <button 
                                className={styles.btn}
                                onClick={() => setisEditing(true)}>
                                Edit Profile
                            </button>

                        </div>
                    </>

                ) : (
                    <div className={styles.editAct}>
                        <button 
                            className={styles.btn}
                            onClick={saveChange}
                            disabled={toSave}>

                                Save

                        </button>
                        <button 
                            className={styles.btn}
                            onClick={() => {
                                        setUserData({
                                            username: userInfo.username,
                                            gender: userInfo.gender,
                                            email: userInfo.email,
                                            contact_number: userInfo.contact_number,
                                            user_id: userInfo.user_id,
                                            avatar: userInfo.avatar
                                        });
                                        setisEditing(false);

                            }}>
                            Cancel

                        </button>

                    </div>
                )}


            </div>



        </div>
        


    </div>
  )
}

export default SellerProfile