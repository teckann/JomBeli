'use client';

import { useState,useRef } from "react";
import Styles from "./EditProfileWidget.module.css";
import Modal from "../Modals/Modal";
import Image from "next/image";
import { updateUserData,uploadAvatar } from "@/app/_lib/actions";

export default function EditProfileWidget({ userInfo }){
    
    const activeImage = userInfo?.avatar?.length > 0 ? userInfo.avatar[0] : null;

    const [errorMessage, setErrorMessage] = useState("");
    const [previewUrl, setPreviewUrl] = useState(activeImage);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null); //reference for hidden input

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file)
            setPreviewUrl(URL.createObjectURL(file)); //preview the image after selecting
        }
    }

    const SaveProfile = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsUploading(true);

        try{
            let finalImageUrl = activeImage;

            if(selectedFile){
                const fileEnvelope = new FormData();
                fileEnvelope.append('file', selectedFile)

                finalImageUrl = await uploadAvatar(fileEnvelope)
            };

            const formData = new FormData(e.target);

            //combine data and image link into one object
            const updatedData = {
                username: formData.get("username"),
                gender: formData.get("gender"),
                email: formData.get("email"),
                contact_number: formData.get("contact_number"),
                avatar: finalImageUrl
            };

            await updateUserData(userInfo.user_id, updatedData);

            setIsOpen(false); //close when success

        } catch(error){
            setErrorMessage(error.message);
        } finally {
            setIsUploading(false);
        }

    };

    return(
        <>
            <button className={Styles.editButton} onClick={() => setIsOpen(true)}>
                Edit Profile
            </button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit User Profile">
                <form onSubmit={SaveProfile}>
                    <div className={Styles.modalBody}>
                        <div className={Styles.formFields}>
                            <div className={Styles.fieldGroup}>
                                <label className={Styles.label}>Username:</label>
                                <input className={Styles.textBox} type="text" name="username" defaultValue={userInfo.username}/>
                            </div>
                            <div className={Styles.fieldGroup}>
                                <label className={Styles.label}>Gender:</label>
                                <input className={Styles.textBox} type="text" name="gender" defaultValue={userInfo.gender}/>
                            </div>
                            <div className={Styles.fieldGroup}>
                                <label className={Styles.label}>Email:</label>
                                <input className={Styles.textBox} type="text" name="email"defaultValue={userInfo.email}/>
                            </div>
                            <div className={Styles.fieldGroup}>
                                <label className={Styles.label}>Contact Number:</label>
                                <input className={Styles.textBox} type="text" name="contact_number" defaultValue={userInfo.contact_number}/>
                            </div>
                        </div>

                        <div className={Styles.avatarSection}>
                            <div className={Styles.avatarCircle}>
                                {previewUrl && typeof previewUrl === 'string' ? (
                                    <Image 
                                        className={Styles.image} 
                                        src={previewUrl}
                                        alt="User Avatar" 
                                        width={150} 
                                        height={150}>
                                    </Image>
                                ):(
                                    <div className={Styles.noImage}>No image found, consider to upload one</div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                />
                        </div>
                            <button type="button" className={Styles.uploadBtn} onClick={() => fileInputRef.current.click()}>
                                Change Avatar
                            </button>
                        </div>  
                    </div>
                    {errorMessage && (
                        <div className={Styles.errorText}>
                            {errorMessage}
                        </div>
                    )}
                    <div className={Styles.buttonGroup}>
                        <button type="submit" className={Styles.saveButton}>
                            {isUploading ? "Saving" : "Save changes"}
                        </button>
                        <button type="button" className={Styles.cancelButton} onClick={() => setIsOpen(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}