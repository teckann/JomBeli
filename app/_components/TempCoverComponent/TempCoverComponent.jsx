import Image from "next/image";
import styles from "./TempCoverComponent.module.css";

function TempCoverComponent({ imagePath, alt, title, desc }) {
  return (
    <div className={styles.mainNoData}>
      <div className={styles.imageContainer}>
        <Image src={imagePath} alt={alt} fill className={styles.image} />
      </div>

      <div className={styles.noDataContainer}>
        <h2>{title}</h2>
        <p>{desc}</p>
      </div>
    </div>
  );
}

export default TempCoverComponent;
