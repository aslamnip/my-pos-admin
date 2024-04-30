import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CustomTable.module.css'

function CustomTable(props) {
    const { tableData } = props
    return (
        <div className={styles.CustomTable}>
            <div className={styles.CustomTable2nd}>
                <div className={styles.cutomRowHeader}>
                    <div className={styles.cutomHeader}>Product</div>
                    <div className={styles.cutomHeader}>Prcie</div>
                    <div className={styles.cutomHeader}>Views</div>
                </div>
                <div>
                    {
                        tableData && tableData.map(data =>
                            <div className={styles.cutomRow} key={data.id}>
                                <div className={styles.cutomRowData} ><Link className='text-decoration-none' to={`/product/${data.slug}`}>{data.name.slice(0,55)}</Link></div>
                                <div className={styles.cutomRowData} >{data.price}</div>
                                <div className={styles.cutomRowData} >{data.views}</div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default CustomTable;