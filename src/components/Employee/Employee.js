/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import SideNav from '../SideNav/SideNav';
import { fetchUrl } from '../../config';
import { AllContext } from '../../AllContext';
import Loading from '../Loading/Loading';
import DeleteModal from '../DeleteModal/DeleteModal';

function Employee() {
    const accessToken = localStorage.getItem('access_token')
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const [isLoading, setIsLoading] = useState(true)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const route = useNavigate()

    const addEmployee = (e) => {
        setIsLoading(true)
        e.preventDefault()
        const newForm = new FormData()
        newForm.append('username', username)
        newForm.append('password', password)
        newForm.append('is_staff', true)

        fetch(`${fetchUrl}/api/register/employee/`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${accessToken}` },
            body: newForm
        })
            .then(res => {
                setIsLoading(false)
                if (res.ok) {
                    route(0)
                    setShowAlert(true)
                    setAlertText(`Employee Added Success`)
                    setAlertVariant('success')
                    setUsername('')
                    setPassword('')
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
    const [employee, setEmployee] = useState([])
    useEffect(() => {
        fetch(`${fetchUrl}/api/employee/`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => { setEmployee(data); setIsLoading(false); })
    }, [accessToken])


    const deleteEmployee = (id) => {
        setIsLoading(true)
        fetch(`${fetchUrl}/api/employee/delete/${id}/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: 'DELETE'
        })
            .then(res => {
                setIsLoading(false)
                if (res.status === 204) {
                    route(0)
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
                        {employee && employee.length > 0 ?
                            <div>
                                <div className='col-md-6 ms-3 mt-5'>
                                    <h4>Add a Employee</h4>
                                    <form onSubmit={addEmployee}>
                                        <div>
                                            <label className='form-label' htmlFor="username">Username</label>
                                            <input minLength={3} required value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder='Username' className='form-control mb-3' />
                                        </div>
                                        <div>
                                            <label className='form-label' htmlFor="password">Password</label>
                                            <input minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password' className='form-control mb-3' />
                                        </div>
                                        <div>
                                            <input disabled defaultChecked type="checkbox" className='form-check-input' />
                                            <label className='form-check-label ms-1 mb-3' htmlFor="password">Is Admin</label>

                                        </div>
                                        <input className='btn btn-dark' type="submit" value="Add Employee" />
                                    </form>
                                </div>
                                <div>
                                    <div className='p-5 col-md-6'>
                                        <h4>Employee List</h4>
                                        <Table striped hover>
                                            <thead>
                                                <tr>
                                                    <th>Employee Name</th>
                                                    <th className='text-center'>Total Order Confirmed</th>
                                                </tr>
                                            </thead>


                                            <tbody >
                                                {employee && employee.map(data =>
                                                    <tr key={data.username}>
                                                        <td>{data.username}</td>
                                                        <td className='text-center'>{data.total_orders}</td>
                                                        <td><DeleteModal iconText={<FontAwesomeIcon icon={faClose} />} warning={`Are you sure to delete ${data.username}?`} handlefunction={() => deleteEmployee(data.id)} /></td>
                                                    </tr>
                                                )}
                                            </tbody>


                                        </Table>
                                    </div>
                                </div>
                            </div>
                            : <div> <h3>You Have No Permission !!</h3></div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Employee;