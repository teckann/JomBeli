import ProductListing from "@/app/_components/ProductListing/ProductListing";
import { getSellerInfo, getSellerRating, getSellerTotalProduct } from "@/app/_lib/dynamic-services";
import Image from "next/image";
import Styles from "./page.module.css";
import Link from "next/link";

const categories = [
  {
    id: 1,
    title: "Devices",
    icon: "M9 2a7 7 0 0 0-7 7v6a7 7 0 0 0 7 7h6a7 7 0 0 0 7-7V9a7 7 0 0 0-7-7H9zm0 2h6a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9a5 5 0 0 1 5-5z",
  },
  {
    id: 2,
    title: "Audio",
    icon: "M12 3a4 4 0 0 0-4 4v4H6a2 2 0 0 0-2 2v2h2v-2h12v2h2v-2a2 2 0 0 0-2-2h-2V7a4 4 0 0 0-4-4z",
  },
  {
    id: 3,
    title: "Charging",
    icon: "M11 21v-6H7l6-11v6h4l-6 11z",
  },
  {
    id: 5,
    title: "Accessories",
    icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16z",
  },
  {
    id: 6,
    title: "Gaming",
    icon: "M21 6H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm-9 9-3-2v-4l3-2 3 2v4l-3 2z",
  },
  {
    id: 4,
    title: "Smart Home",
    icon: "M12 3l9 8h-3v8h-4v-5H10v5H6v-8H3l9-8z",
  },
  {
    id: 9,
    title: "Fashion",
    icon: "M7 3h10l2 4-7 3-7-3 2-4zm-2 7 7 3 7-3v11H5V10z",
  },
  {
    id: 10,
    title: "Lifestyle",
    icon: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 5v5h4v2h-6V7h2z",
  },
  {
    id: 7,
    title: "Sports",
    icon: "M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z",
  },
  {
    id: 8,
    title: "Health",
    icon: "M10 3h4v6h6v4h-6v6h-4v-6H4V9h6V3z",
  },
  {
    id: 11,
    title: "Office",
    icon: "M4 4h16v16H4V4zm3 3v10h10V7H7z",
  },
  {
    id: 12,
    title: "Others",
    icon: "M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm0 14h.01M12 8v4",
  },
];


export default async function ShopProfile({ params, searchParams }){

    const {sellerID} = await params;
    const filterParam = await searchParams;
    const filter = filterParam.filter;
    const sellerInfo = await getSellerInfo(sellerID);
    const sellerRating = await getSellerRating(sellerID);
    const totalProduct = await getSellerTotalProduct(sellerID);

    return(
        <div>
            <ShopProfileHeader sellerInfo={sellerInfo} sellerRating={sellerRating} totalProduct={totalProduct}/>
            <hr className={Styles.breakLine}/>
            <div className={Styles.bottomSection}>
                <div className={Styles.filterWrapper}>
                    <ShopFilter sellerID={sellerID}/>
                </div>
                <div className={Styles.listingWrapper}>
                    <ProductListing type={"seller"} filter={filter} sellerID={sellerID}/>
                </div>  
            </div>
        </div>

    )
}


const ShopProfileHeader = ({sellerInfo, sellerRating, totalProduct}) => {
    return(
        <div>
            <div className={Styles.profileContainer}>
                <Image className={Styles.avatar} src={sellerInfo.avatar} width={250} height={250} alt={sellerInfo.username}></Image>
                <div className={Styles.infoContainer}>
                    <h1 className={Styles.shopName}>{sellerInfo.username}</h1>
                    <div className={Styles.linkContainer}>
                        <Link href={`/buyer/chat?id=${sellerInfo.user_id}`}>Chat</Link>
                        <Link href={`/buyer/vouchers?id=${sellerInfo.user_id}`}>Voucher</Link>
                    </div>
                    <p className={Styles.infoText}>Total Product: {totalProduct}</p>
                    {sellerRating? <p className={Styles.infoText}>Rating: {sellerRating}</p>: <p className={Styles.infoText}>No Rating Found</p>}
                </div>
            </div>
        </div>
    )
}

const ShopFilter = ({sellerID}) => {
    return(
        <div className={Styles.filterContainer}>
            <h2>Category</h2>
            <hr className={Styles.breakLine}/>
            {categories.map((item)=>(
                <Link
                    key={item.id}
                    href={`/buyer/shopProfile/${sellerID}?filter=${item.title}`}
                    className={Styles.categoryLink}
                >
                    <svg
                        className={Styles.categoryIcon}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d={item.icon} />
                    </svg>
                    {item.title}
                </Link>
            ))}
        </div>
    )
}