import Styles from './AdminShowInformationList.module.css';

export default function ShowItemInformationList({ objectlist }) {
    
    return (
        <div className={ Styles.informationListFrame }>
            {/* <AdminTitle title={itemTitle} /> */}
            <div className={ Styles.informationSpace }>
                {objectlist.map((each, index) => {
                    return <div key={index} className={ Styles.informationRow }>
                        <div className={ Styles.informationField }>
                            {each.field}
                        </div>
                        <div className={ Styles.informationMiddleQuote }>:</div>
                        <div className={ Styles.informationValue}>
                            {each.value}
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}

export function AdminTitle({title}) {
    return (
        <div className={ Styles.titleBar }>
            <span classname={Styles.titleText}>{title}<hr className={Styles.hrLength} /></span>
        </div>
    )
}