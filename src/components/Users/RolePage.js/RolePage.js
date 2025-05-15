/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Dropdown } from 'react-bootstrap';
import { AllContext } from '../../../AllContext';
import SideNav from '../../SideNav/SideNav';
import Loading from '../../Loading/Loading';
import { fetchUrl } from '../../../config';

import './RolePage.css'
import EditRole from '../EditRole/EditRole';
import DeleteModal from '../../DeleteModal/DeleteModal';

function RolePage() {
    const accessToken = localStorage.getItem('access_token')
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`${fetchUrl}/api/roles/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                setRoles(data);
                setIsLoading(false);
            });
    }, []);

    const handlefunction = (id) => {
        setIsLoading(true)
        fetch(`${fetchUrl}/api/role/${id}/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: 'DELETE',
        })
            .then(res => {
                setIsLoading(false)
                if (res.status === 204) {
                    navigate(0)
                    setShowAlert(true)
                    setAlertText(` Delete Success`)
                    setAlertVariant('success')
                }
                else {
                    setShowAlert(true)
                    setAlertText(`Fail to Delete`)
                    setAlertVariant('danger')
                }
            })
            .catch(() => {
                setShowAlert(true)
                setAlertText(`Fail to Delete`)
                setAlertVariant('danger')
            })
    }
    return (
        <div>
            {isLoading ? <Loading /> : (null)}
            <div className='NavRow'>
                <SideNav />
                <div className='bodyLayout'>
                    <div className="container mt-4">
                        <div >

                            <div className=" mt-md-0 mt-5">
                                <div className='row'>
                                    <div className='col'>
                                        <h4 className='my-3'>Role List</h4>
                                    </div>
                                    <div className='col d-flex justify-content-end'>
                                        <EditRole
                                            setIsLoading={setIsLoading}
                                            roles={roles}
                                            setRoles={setRoles}
                                            fetchUrl={`${fetchUrl}/api/roles/`}
                                            buttonStyle='submitButtonx'
                                            method='POST'
                                            buttonText='Create A Role'
                                        />
                                    </div>

                                </div>
                                <div className='table-responsive'>
                                    <Table responsive='lg' className="table table-bordered table-hover">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Role</th>
                                                <th>Description</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {roles.map((r) => (
                                                <tr key={r.id}>
                                                    <td>{r.role}</td>
                                                    <td>{r.description}</td>
                                                    <td>
                                                        <Dropdown>
                                                            <Dropdown.Toggle variant="outline-primary">
                                                                Action
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item>
                                                                    <EditRole
                                                                        setIsLoading={setIsLoading}
                                                                        roles={roles}
                                                                        setRoles={setRoles}
                                                                        fetchUrl={`${fetchUrl}/api/role/${Number(r.id)}/`}
                                                                        buttonStyle='btn btn-dark'
                                                                        method='PATCH'
                                                                        isUpdate
                                                                        roleData={r}
                                                                        buttonText='Edit'
                                                                    />
                                                                </Dropdown.Item>
                                                                <Dropdown.Item>
                                                                    <DeleteModal
                                                                     handlefunction = {()=>handlefunction(r.id)}
                                                                     iconText = "Delete"
                                                                     warning='Are You Sure to Delete This Role ?'
                                                                      />
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default RolePage;
