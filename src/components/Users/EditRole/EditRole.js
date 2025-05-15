/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { AllContext } from '../../../AllContext';


function EditRole({ fetchUrl, setIsLoading, roles, setRoles, buttonText, buttonStyle, method, isUpdate, roleData }) {
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext);
    const [role, setRole] = useState('');
    const [description, setDescription] = useState('');
    const [show, setShow] = useState(false);
    const route = useNavigate()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    useEffect(() => {
        if (isUpdate && roleData) {
            setRole(roleData.role)
            setDescription(roleData.description)
        }
    }, [isUpdate, roleData])

    const handleCreateRole = (e) => {
        console.log('object');
        handleClose()
        setIsLoading(true)
        e.preventDefault();
        fetch(fetchUrl, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify({ role, description }),
        })
            .then(res => {
                if (res.ok) return res.json();
                throw new Error("Failed to create role");
            })
            .then(data => {
                setIsLoading(false)
                if (!isUpdate) {
                    setRoles([...roles, data]);
                }
                if (isUpdate) {
                    route(0)
                }
                setAlertText(`Role ${isUpdate ? 'Update' : 'created'} successfully!`);
                setAlertVariant("success");
                setShowAlert(true);
                setRole('');
                setDescription('');
            })
            .catch(err => {
                setIsLoading(false)
                setAlertText(`Failed to ${isUpdate ? 'Update' : 'created'} role!`);
                setAlertVariant("danger");
                setShowAlert(true);
                console.log(err);
            });
    };


    return (
        <div>
            <button type='button' className={buttonStyle} onClick={handleShow}>
                {buttonText}
            </button>

            <Modal backdrop="static" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title> <h4>{buttonText}</h4></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className="">
                            <form onSubmit={handleCreateRole}>

                                <div className="mb-3">
                                    <label className="form-label">Role</label>
                                    <input placeholder='--Admin--' type="text" value={role} onChange={(e) => setRole(e.target.value)} className="form-control" required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea placeholder='Ex- Can Conrtrol Everythings' value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" rows="3" />
                                </div>
                                <button onClick={handleCreateRole} type="submit" className="btn btn-primary">Confrim</button>
                            </form>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>

    );
}

export default EditRole;