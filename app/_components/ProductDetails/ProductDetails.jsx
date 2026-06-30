import {
  getOptionValues,
  getProductOptions,
  getSingleProduct,
  getSKU,
} from "@/app/_lib/dynamic-services";
import styles from "./ProductDetails.module.css";
import ProductClientView from "../ProductClientView/ProductClientView";
import ProductImageCarousel from "../ProductImageCarousel/ProductImageCarousel";

function generateVariants(options) {
  return options.reduce(
    (acc, option) => {
      const result = [];

      for (const item of acc) {
        for (const value of option.values) {
          result.push({
            ...item,
            [option.name]: value,
          });
        }
      }

      return result;
    },
    [{}],
  );
}

async function ProductDetails({ productId }) {
  // general info
  const productInfo = await getSingleProduct(productId);
  // console.log(productInfo);

  // option details + option ids
  const productOptions = await getProductOptions(productId);
  const optionIds = productOptions.map((opt) => opt.option_id);
  // console.log(productOptions);

  // value
  const optionValues = await Promise.all(
    optionIds.map((id) => getOptionValues(id)),
  );
  // console.log(optionValues);

  // option + value mapping
  const merged = productOptions.map((opt, index) => ({
    ...opt,
    values: optionValues[index].map((v) => v.option_value),
  }));
  // console.log(merged);

  // available sku
  const DBsku = await getSKU(productId);

  const skuList = DBsku.map((item) => {
    const parts = item.sku.split(" * ");

    const mapped = {};

    productOptions.forEach((opt, index) => {
      mapped[opt.option_name] = parts[index];
    });

    return {
      ...item,
      ...mapped,
    };
  });

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.imageContainer}>
        <ProductImageCarousel productImages={productInfo.product_image_url} />
      </div>

      <ProductClientView
        product={productInfo}
        optionValues={merged}
        sku={skuList}
      />
    </div>
  );
}

export default ProductDetails;
