import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import SideNav from '../SideNav/SideNav';
import { fetchUrl } from '../../config';

function Users() {
    const [users, setUsers] = useState('')
    const accessToken = localStorage.getItem('access_token')
    useEffect(() => {
        fetch(`${fetchUrl}/api/all/user/`,{
            headers: { "Authorization": `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => setUsers(data))
    }, [accessToken])
    const filterUsers = users.length > 0 ? users.filter(data => data !== null) : []


    return (
        <div>
            <div className='NavRow'>
                <div>
                    <SideNav />
                </div>
                <div className='bodyLayout '>
                    <div>
                        <Table striped hover>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Name</th>
                                    <th>Total Order</th>
                                </tr>
                            </thead>


                            <tbody >
                                {filterUsers && filterUsers.map(data =>
                                    <tr key={data.id}>
                                        <td>{data.username}</td>
                                        <td>{`${data.first_name} ${data.last_name}`}</td>
                                        <td>{data.total_orders}</td>
                                    </tr>
                                )}
                            </tbody>


                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Users;