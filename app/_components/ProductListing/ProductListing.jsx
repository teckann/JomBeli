import {
  getDiscountProducts,
  getHotProducts,
  getDiscoverProducts,
  getFilterProducts,
  getFilterProductsBySellerID,
} from "@/app/_lib/data-services";
import { getAllProducts } from "@/app/_lib/buyer-products-services";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductListing.module.css";
import TempCoverComponent from "../TempCoverComponent/TempCoverComponent";
import { getProducts, getProductsBySellerID, searchProducts } from "@/app/_lib/dynamic-services";

async function ProductListing({ type, filter, sellerID, keyword}) {
  let products = [];

  if (type === "discountProducts") products = await getDiscountProducts();
  if (type === "hotselling") products = await getHotProducts();
  if (type === "discover") products = await getDiscoverProducts();
  if (type === "seller") products = await getProductsBySellerID(sellerID);
  if (filter) products = await getAllProducts();

  let displayProducts;

  if (sellerID){
    displayProducts = await getFilterProductsBySellerID(filter, sellerID);
  } else if (keyword){
    displayProducts = await searchProducts(keyword);
  } else if (filter === "all") {
    displayProducts = products;
  } else if (filter !== "") {
    displayProducts = await getFilterProducts(filter);
  }

  if (filter || keyword)
    return (
      <>
        {displayProducts.length === 0 ? (
          <div className={styles.tempCoverContainer}>
            <TempCoverComponent
              imagePath="/data-not-found.png"
              alt="Data not found"
              title="No Products Available in This Category"
              desc="We're constantly updating our catalog. Explore other categories for more options."
            />
          </div>
        ) : (
          <div className={styles.main}>
            {displayProducts.map((product) => (
              <ProductCard
                key={product.product_id}
                product={product}
                type={type}
              />
            ))}
          </div>
        )}
      </>
    );

  if (type)
    return (
      <div className={styles.main}>
        {products.map((product) => (
          <ProductCard key={product.product_id} product={product} type={type} />
        ))}
      </div>
    );
}

export default ProductListing;
