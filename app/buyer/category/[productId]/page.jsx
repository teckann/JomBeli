import { getProducts, getSingleProduct } from "@/app/_lib/dynamic-services";
import styles from "./page.module.css";
import ProductDetails from "@/app/_components/ProductDetails/ProductDetails";
import ProductDetailsBackButton from "@/app/_components/ProductDetailsBackButton/ProductDetailsBackButton";

export async function generateMetadata({ params }) {
  const { productId } = await params;
  console.log(productId);
  const { product_name: name } = await getSingleProduct(productId);

  return { title: `${name}` };
}

// my laptop very hot, so ignore it first
// export async function generateStaticParams() {
//   const products = await getProducts();

//   const ids = products.map((product) => ({
//     productId: String(product.product_id),
//   }));

//   return ids;
// }

async function page({ params }) {
  const { productId } = await params;

  const { user_id: sellerId } = await getSingleProduct(productId);

  return (
    <main className={styles.main}>
      <ProductDetailsBackButton />

      <div className={styles.contentContainer}>
        <ProductDetails productId={productId} />

        <SellerInfo userId={sellerId} />
      </div>
    </main>
  );
}

const SellerInfo = ({ userId }) => {
  return (
    <div className={styles.sellerContainer}>
      <p>{userId}</p>
    </div>
  );
};

export default page;
