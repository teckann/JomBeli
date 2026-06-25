import Styles from './AdminItemCard.module.css';
import Image from "next/image";

export default function AdminItemCard({id, name, category, itemStatus, imageUrl}) {

    return (
        <div className={ Styles.itemCard }>
            <div>
                <Image className={Styles.itemImage} src={imageUrl} alt="Product Image" width={300} height={300} />
            </div>
            <div className={ Styles.cardDescription }>
                <div>
                    <h3>{name}</h3>
                </div>
                <div className={ Styles.smallDescripOne}>
                    <span className={ Styles.smallDescripDiv }>{id}</span>
                    <span className={ Styles.smallDescripDiv }>{category}</span>
                </div>
                <div>
                    <span className={ `${Styles.smallDescripDiv} ${itemStatus === "Active" ? Styles.green : Styles.red}` }>{itemStatus}</span>
                </div>
            </div>
        </div>
    );
}