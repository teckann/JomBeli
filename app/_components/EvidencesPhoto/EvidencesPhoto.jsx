"use client";

import Styles from './EvidencesPhoto.module.css';
import Image from 'next/image';
import { useState } from "react";
import { NextIcon, BackIcon } from '@/app/_components/AdminSliceShow/AdminSlideShow';

export default function EvidencesPhoto({ evidence }) {
    const [photoIndex, setPhotoIndex] = useState(0);

    const handleDeduct = () => {
        if (photoIndex > 0) {
            setPhotoIndex(prev => prev - 1);
        }
    }

    const handleAdd = () => {
        if (photoIndex < evidence.length - 1) {
            setPhotoIndex(prev => prev + 1);
        }
    }

    const evidencsExist = evidence?.length > 0;

    return (
        <div className={ Styles.evidenceShowContainer }>
            <div className={ Styles.navBar}>
                <button className={` ${Styles.navButton} ${!evidencsExist && Styles.hide}`} onClick={handleDeduct}>
                    <BackIcon />
                </button>
            </div>
            <div className={ Styles.evidenceContainer }>
                <div className={ Styles.evidenceTitle}>
                    {evidencsExist && <h3>Evidences</h3>}
                </div>
                <div className={ Styles.evidenceImageContainer }>
                    {evidencsExist ? <Image src={evidence[photoIndex]} alt={`Evidence ${photoIndex + 1}`} width={400} height={400} className={ Styles.evidenceImage } /> : 
                    <div className={ Styles.noEvidenceText }>No evidence provided</div>}
                </div>
            </div>
            <div className={ Styles.navBar}>
                <button className={ `${Styles.navButton} ${!evidencsExist && Styles.hide} `} onClick={handleAdd}>
                    <NextIcon />
                </button>
            </div>
        </div>
    )
}