import React, { useState, useEffect, useContext } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DeleteModal from '../DeleteModal/DeleteModal';
import SideNav from '../SideNav/SideNav';
import { fetchUrl } from '../../config';
import Loading from '../Loading/Loading';
import { AllContext } from '../../AllContext';
import styles from './Users.moudle.css'

function Users() {
    const accessToken = localStorage.getItem('access_token')
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const [isLoading, setIsLoading] = useState(true)

    const [allUsers, setAllusers] = useState([])
    useEffect(() => {
        fetch(`${fetchUrl}/api/users/`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => { setAllusers(data); setIsLoading(false); })
    }, [accessToken])
   
    const deleteEmployee = (id) => {
        setIsLoading(true)
        fetch(`${fetchUrl}/api/employee/delete/${id}/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: 'DELETE'
        })
            .then(res => {
                setIsLoading(false)
                if (res.ok) {
                    setShowAlert(true)
                    setAlertText(` Delete Success`)
                    setAlertVariant('success')
                }
                else {
                    setShowAlert(true)
                    setAlertText(`Fail to update`)
                    setAlertVariant('danger')
                }
            })
            .catch(() => {
                setIsLoading(false)
                setShowAlert(true)
                setAlertText(`Fail to update`)
                setAlertVariant('danger')
            })
    }

    return (
        <div>
            <div className='NavRow'>
                {isLoading ? <Loading /> : null}
                <div>
                    <SideNav />
                </div>
                <div className='bodyLayout '>

                    <div>
                        <div className='p-5 '>
                            <h4 className='mb-5'>Sales Managers List</h4>
                            <Table  hover responsive='lg'>
                                <thead>
                                    <tr  className={styles.tableHeader}>
                                        <th>Username</th>
                                        <th>Sales Manager</th>
                                        <th className='text-center'>Phone  </th>
                                        <th className='text-center'>Role  </th>
                                        <th className='text-center'>Order</th>
                                        <th className=''> Delete</th>
                                    </tr>
                                </thead>


                                <tbody >
                                    {allUsers && allUsers.map(data =>
                                        <tr  key={data.username}>
                                            <td><Link className='' to={`/user/${data.username}`}>{data.username}</Link> </td>
                                            <td>{data.name}</td>
                                            <td className='text-center'>{data.phone}</td>
                                            <td className='text-center'>{data.role ? data.role : 'User'}</td>
                                            <td className='text-center'>{data.total_orders}</td>
                                            <td><DeleteModal iconText='Delete' warning={`Are you sure to delete ${data.username}?`} handlefunction={() => deleteEmployee(data.id)} /></td>
                                        </tr>
                                    )}
                                </tbody>


                            </Table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Users;