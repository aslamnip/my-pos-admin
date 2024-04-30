import React, { useEffect, useState } from 'react';
import SideNav from '../SideNav/SideNav';
import styles from './SavedReport.module.css';
import { fetchUrl } from '../../config';
import Loading from '../Loading/Loading';


function SavedReport() {
    const [saveReports, setSaveReports] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const accessToken = localStorage.getItem('access_token')

    useEffect(() => {
        fetch(`${fetchUrl}/api/save-report/?ordering=-id`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
        })
            .then(res => res.json())
            .then(data => {
                setSaveReports(data);
                setIsLoading(false)
            })
    }, [accessToken])
    return (
        <div>
            {isLoading ? <Loading /> : null}
            <div className='NavRow'>
                <div>
                    <SideNav />
                </div>
                <div className='bodyLayout '>
                    {saveReports && saveReports.map((data) =>
                        <div key={data.id}>
                            <div className='my-5 pt-5'>
                                <div>
                                    <h2 className='text-center'>{data.title}</h2>
                                    <div className={styles.anlyzeRow} >
                                        <div className='d-flex'> <p>Due Collect</p> <p><b>{data.due} tk.</b></p></div>
                                        <div className='d-flex'> <p>Advance Receive</p> <p><b>{data.advance} tk.</b></p></div>
                                        <div className='d-flex'> <p>Purchase Cost</p> <p><b>{data.ppcost} tk.</b></p></div>
                                        <div className='d-flex'> <p>Shipping Cost</p> <p><b>{data.shippingcost} tk.</b></p></div>
                                        <div className='d-flex'> <p>Ad Cost</p> <p><b>{data.adcost} tk.</b></p></div>
                                        <div className='d-flex'> <p>Rent & Salary</p> <p><b>{data.rentcost} tk.</b></p></div>
                                        <div className='d-flex'> <p>Others Cost</p> <p><b>{data.othercost} tk.</b></p></div>
                                        <div className='d-flex'> <p>Profit</p> <p><b>{data.profit} tk.</b></p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                    }
                </div>
            </div>
        </div>
    );
}

export default SavedReport;