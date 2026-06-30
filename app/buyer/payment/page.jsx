import { getCartItemsByCartItemID, getUserAddresses, getUserVouchers, validateCartItemOwnership } from "@/app/_lib/data-services";
import { redirect } from "next/navigation";
import { getUser } from "@/app/_lib/auth";
import BuyerCheckoutClient from "@/app/_components/BuyerCheckoutClient/BuyerCheckoutClient";

export default async function CheckoutPage({ searchParams }) {
    const params = await searchParams;
    const itemIdsString = params?.items;

    if (!itemIdsString) {
        redirect("/buyer/cart");
    }

    const itemIds = itemIdsString.split(",");

    const user = await getUser();
     
    const checkoutItems = await getCartItemsByCartItemID(itemIds);
    const shopID = checkoutItems[0].PRODUCT_VARIANTS_T.PRODUCTS_T.user_id;

    const validCart = await validateCartItemOwnership(itemIds, user.id);
    const availableVouchers = await getUserVouchers(user.id, shopID);

    if(!validCart){
        redirect("/buyer/cart");
    }

    const addresses = await getUserAddresses(user.id);

    const { totalOriginalPrice, totalDiscountedPrice } = checkoutItems
    .reduce(
        (totals, item) => {
        const { product_variant_price: originalPrice, PRODUCTS_T } = item.PRODUCT_VARIANTS_T;
        const discountPercent = PRODUCTS_T?.discount || 0;
        const quantity = item.quantity;

        const itemOriginalTotal = originalPrice * quantity;
        
        const discountAmount = originalPrice * (discountPercent / 100);
        const finalItemPrice = originalPrice - discountAmount;
        const itemDiscountedTotal = finalItemPrice * quantity;

        totals.totalOriginalPrice += itemOriginalTotal;
        totals.totalDiscountedPrice += itemDiscountedTotal;

        return totals;
        },
        { totalOriginalPrice: 0, totalDiscountedPrice: 0 }
    );
    const totalSaved = totalOriginalPrice - totalDiscountedPrice;

    return (
        <BuyerCheckoutClient 
            checkoutItems={checkoutItems} 
            addresses={addresses}
            vouchers={availableVouchers}
            total={{totalOriginalPrice, totalSaved}} 
            userID={user.id}
        />
    );
}