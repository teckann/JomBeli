// "use client";

import Styles from "./AdminFilterProductsBars.module.css"
import { getProducts } from "@/app/_lib/data-services";
import {CategorySelect } from "./AdminFilterProductsClient";

export  default async function AdminFilterProductsBar() {

    const products = await getProducts();
    console.log(products);

    // filter the same category (... is used to create new array, set must combine with new to construct new object)
    const distinctCategory = [... new Set(products.map((product) => product.category))];
    // console.log(distinctCategory);

    // const [products, setProducts] = useState([]);

    // useEffect(() => {
    //     async function fetchProducts() {
    //         const productLists = getProducts();
    //         setProducts(productLists);
    //     }
    // }, []);

    console.log(products);
    
    

    return (
        <div className={Styles.tableRelatedContainer}>
            <div className={Styles.filterRelatedContainer}>
                <div className={Styles.searchBarContainer}>
                    <input type="text" placeholder="Search by Product Name" />
                </div>
                <div className={Styles.filterBarsContainer}>
                    <CategorySelect categories={distinctCategory} />
                </div>
            </div>
        </div>
    );
}