import Styles from "./ManageVoucher.module.css";
import AdminTable from "@/app/_components/AdminTable/AdminTable";
import { getFilterVoucher } from "@/app/_lib/analysis-serives";
import { AdminFilterVouchers } from "@/app/_components/AdminFilterVouchers/AdminFilterVouchers"

export default async function manageVoucher({ searchParams }) {

    const { type, voucher, status } = await searchParams;

    const voucherList = await getFilterVoucher(type, voucher, status);
    
    const titles = ["Voucher Name","Start Date", "End Date", "Discount Value","Quantity","Voucher Type","Status"];

    const fields = ["voucher_name","start_date", "end_date", "discount_value","quantity","voucher_type","voucher_status"];

    const actions=[{type:"viewVouchers"}];

    const datas = voucherList;

    return (
        <div className={Styles.contentPage}>
            <div className={Styles.upperPart}>
                <div className={Styles.pageDescription}>
                    <h1>Manage Vouchers</h1>
                    <p>Manage All Vouchers Right Now!</p>
                </div>
            </div>
            <div>
                <AdminFilterVouchers />
            </div>
            <div>
                <AdminTable titles={titles} fields={fields} actions={actions} datas={datas} dataIdFormat={"voucher_id"}/>
            </div>
        </div> 
    )
}