"use client";

import { useState } from "react";
import styles from "./ProductClientView.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

function ProductClientView({
  product,
  optionValues,
  sku,
  productOverallRating,
}) {
  // console.log(product);
  // console.log(optionValues);
  // console.log(sku);

  const {
    product_name: name,
    price: productPrice,
    stock_quantity: productStock,
    discount,
    product_id,
  } = product;

  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentSku, setCurrentSku] = useState(null);
  const [price, setPrice] = useState(productPrice);
  const [stock, setStock] = useState(productStock);
  const [quantity, setQuantity] = useState(1);

  const router = useRouter();

  // check got discount or not
  const hasDiscount = discount ?? false;
  const finalPrice = hasDiscount ? price * ((100 - discount) / 100) : price;

  // check if the selection match with the sku
  const matchSku = (selectedOptions, skuList) => {
    return skuList.find((item) => {
      return Object.keys(selectedOptions).every((key) => {
        return item[key] === selectedOptions[key];
      });
    });
  };

  const isValidOption = (optionName, value, selectedOptions, skuList) => {
    const temp = {
      ...selectedOptions,
      [optionName]: value,
    };

    return skuList.some((sku) => {
      return Object.keys(temp).every((key) => {
        return sku[key] === temp[key];
      });
    });
  };

  const handleSelectOption = (optionName, value) => {
    const isSame = selectedOptions[optionName] === value;

    const newSelected = {
      ...selectedOptions,
      [optionName]: isSame ? undefined : value,
    };

    // clean undefined
    Object.keys(newSelected).forEach((key) => {
      if (!newSelected[key]) delete newSelected[key];
    });

    setSelectedOptions(newSelected);

    const matched = matchSku(newSelected, sku);

    const isFullMatch =
      matched && Object.keys(newSelected).length === optionValues.length;

    if (isFullMatch) {
      setCurrentSku(matched);
      setPrice(matched.product_variant_price);
      setStock(matched.product_variant_stock);
    } else {
      setCurrentSku(null);
      setPrice(productPrice);
      setStock(productStock);
    }

    // console.log(currentSku);
  };

  const fetchAPI = async () => {
    const res = await fetch("/api/addtocart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        variantId: currentSku.product_variant_id,
        quantity,
      }),
    });

    const data = await res.json();

    return { res, data };
  };

  const handleAddToCart = async () => {
    if (!currentSku) return;

    const { res } = await fetchAPI();

    if (res.ok) {
      router.push("/buyer/cart");
    }
  };

  const handleBuyNow = async () => {
    if (!currentSku) return;

    const { res, data } = await fetchAPI();

    if (res.ok) {
      const cartItemId = data.cartItemId;

      router.push(`/buyer/payment?items=${cartItemId}`);
    }
  };

  // check the sku is ready or not (for activate buy now button & add to cart button)
  const isSkuReady = !!currentSku;

  return (
    <div className={styles.content}>
      <Header name={name} star={productOverallRating} productID={product_id}/>

      <FinalPrice
        finalPrice={finalPrice}
        hasDiscount={hasDiscount}
        discount={discount}
        price={price}
      />

      <div className={styles.optionContainer}>
        {optionValues.length > 0 ? (
          <>
            {optionValues.map((item) => (
              <Options
                key={item.option_id}
                optionValues={item}
                selectedOptions={selectedOptions}
                sku={sku}
                onSelect={handleSelectOption}
                isValidOption={isValidOption}
              />
            ))}

            <div className={styles.optionDiv}>
              <p className={styles.optionName}>Quantity:</p>

              <div className={styles.options}>
                <input
                  type="number"
                  min="1"
                  max={stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className={`${styles.button} ${styles.quantity}`}
                />

                <p className={styles.stock}>Stock: {stock}</p>
              </div>
            </div>

            <div className={styles.optionDiv}>
              <button
                className={styles.buyNowButton}
                disabled={!isSkuReady}
                onClick={handleBuyNow}
              >
                Buy Now
              </button>

              <button
                className={styles.addCartButton}
                disabled={!isSkuReady}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </>
        ) : (
          <NoOptionsCard />
        )}
      </div>
    </div>
  );
}

const Options = ({
  optionValues,
  selectedOptions,
  sku,
  onSelect,
  isValidOption,
}) => {
  const { option_name: option, values } = optionValues;

  return (
    <div className={styles.optionDiv}>
      <p className={styles.optionName}>{option}:</p>

      <div className={styles.options}>
        {values.map((value, index) => (
          <button
            key={index}
            className={`${styles.button} ${
              selectedOptions[option] === value ? styles.active : ""
            }`}
            onClick={() => onSelect(option, value)}
            disabled={!isValidOption(option, value, selectedOptions, sku)}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

const NoOptionsCard = () => {
  return (
    <div className={styles.noOptionCard}>
      <svg
        className={styles.infoIcon}
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M11 17h2v-6h-2v6zm1-8a1.25 1.25 0 100-2.5A1.25 1.25 0 0012 9zm0-7C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18a8 8 0 110-16 8 8 0 010 16z" />
      </svg>

      <p>Sorry, the merchant has not yet set any options.</p>
    </div>
  );
};

const Header = ({ name, star, productID }) => {
  return (
    <div className={styles.header}>
      <p className={styles.title}>{name}</p>

      <div className={styles.subHeader}>
        <div className={styles.starContainer}>
          <svg
            className={styles.starIcon}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>

          {star != null ? (
            <p>
              {star.toFixed(1)} <span>overall rating</span>
            </p>
          ) : (
            <p>
              <span>No ratings yet</span>
            </p>
          )}
        </div>

        <Link href={`/buyer/contactus?productID=${productID}`} className={styles.reportContainer}>
          <svg
            className={styles.reportIcon}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M1 21h22L12 2 1 21zm11-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>

          <p>Report Item</p>
        </Link>
      </div>
    </div>
  );
};

const FinalPrice = ({ finalPrice, hasDiscount, price, discount }) => {
  return (
    <div className={styles.priceContainer}>
      <div className={styles.price}>
        <span
          className={`${styles.finalPrice} ${hasDiscount && styles.discountColor}`}
        >
          RM {finalPrice.toFixed(2)}
        </span>
        {hasDiscount && (
          <span className={styles.originalPrice}>RM {price?.toFixed(2)}</span>
        )}
      </div>

      {hasDiscount && (
        <div className={styles.discountContainer}>
          <svg
            className={styles.discountIcon}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M21.41 11.58l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.41l9 9a2 2 0 0 0 2.82 0l7-7a2 2 0 0 0 0-2.83zM6.5 7A1.5 1.5 0 1 1 8 8.5 1.5 1.5 0 0 1 6.5 7z" />
          </svg>

          <p>Discount {discount}%</p>
        </div>
      )}
    </div>
  );
};

export default ProductClientView;
