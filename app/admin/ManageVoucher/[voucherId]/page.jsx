import { getVoucherDetails } from "@/app/_lib/data-services";
import Styles from "./VoucherDetails.module.css";
import BackButton from "@/app/_components/AdminBackButton/AdminBackButton";
import AdminDeactivateVoucherButton from "@/app/_components/AdminDeactivateVoucherButton/AdminDeactivateVoucherButton"
import AdminShowInformationList from "@/app/_components/AdminShowInformationList/AdminShowInformationList";
export const revalidate = 0;

export default async function UserDetail({params}){
    const resolvedParams = await params;
    const voucherId = resolvedParams?.voucherId ? String (resolvedParams.voucherId).trim() : ""

    const voucher = await getVoucherDetails(voucherId);
    const voucherInfo = [
        {field:"Voucher Id", value: voucher.voucher_id},
        {field:"Voucher Name", value: voucher.voucher_name},
        {field:"Voucher Type", value: voucher.voucher_type},
        {field:"Discount Value", value: voucher.discount_value},
        {field:"Minimum Spend", value: voucher.min_spend},
        {field:"Maximum Spend", value: voucher.max_spend},
        {field:"Quantity", value: voucher.quantity},
        {field:"Start Date", value: voucher.start_date},
        {field:"End Date", value: voucher.end_date},
        {field:"Status", value: voucher.voucher_status},
        {field:"Created at", value: voucher.created_at},
    ]

    return(
        <div className={Styles.voucherDetailsPage}>
            <div className={Styles.upperContainer}>
                <div className={Styles.buttonContainer}>
                    <BackButton className={Styles.backButton} />
                </div>
                <div className={Styles.pageHeader}>
                    <h1 className={Styles.header}>Voucher details</h1>
                </div>
            </div>
            <div className={Styles.lowerContainer}>
                <div className={Styles.leftSide}>
                    <AdminShowInformationList itemTitle="Voucher details" objectlist={voucherInfo}/>
                    <AdminDeactivateVoucherButton voucherId={voucher.voucher_id} voucherStatus={voucher.voucher_status}/>
                </div>
            </div>
        </div>
    )
}

