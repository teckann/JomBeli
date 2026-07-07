import ProductListing from "@/app/_components/ProductListing/ProductListing";
import Styles from "./page.module.css";
import ProductDetailsBackButton from "@/app/_components/ProductDetailsBackButton/ProductDetailsBackButton";

export default async function SearchPage({ searchParams }){

    const {keyword} = await searchParams;

    return(
        <div>
            <ProductDetailsBackButton/>
            <div className={Styles.container}>
                <h1 className={Styles.title}>Showing product for: "<span>{keyword}</span>"</h1>
                <div className={Styles.products}>
                    <ProductListing
                        type={"search"}
                        keyword={keyword}
                    />
                </div>
            </div>
        </div>
    )
}