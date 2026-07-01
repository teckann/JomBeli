import Styles from './AdminFilterVouchers.module.css';
import { getVoucherInfo } from "@/app/_lib/data-services";
import FilterVouchers from "./AdminFilterVouchersClient";

export async function AdminFilterVouchers(){

    const vouchers = await getVoucherInfo();

    const distinctVouchers = [...new Set(vouchers.map((voucher) => voucher.voucher_type))]

    return(
        <div className={Styles.tableRelatedContainer}>
            <div className={Styles.filterRelatedContainer}>
                <FilterVouchers type={distinctVouchers}/>
            </div>
        </div>
    )
}

