import Styles from './AdminItemCard.module.css';
import Image from "next/image";

export default function AdminItemCard({id, name, category, itemStatus, imageUrl}) {

    const activeImage = imageUrl?.length > 0 ? imageUrl[0] : null;

    return (
        <div className={ Styles.itemCard }>
            <div>
                {console.log(imageUrl)}
                <Image className={Styles.itemImage} src={imageUrl[0]} alt="Product Image" width={100} height={100} />
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