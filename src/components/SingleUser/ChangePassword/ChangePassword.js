/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { fetchUrl } from "../../../config";

function AdminPasswordReset({ userData, accessToken, setIsLoading }) {

    const [nowLoad, setNowLoad] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleAdminPasswordReset = async () => {
        setIsLoading(true)
        setNowLoad(true)
        try {
            const response = await fetch(`${fetchUrl}/api/admin-reset-password/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`, // Ensure admin authentication
                },
                body: JSON.stringify({
                    user_id: Number(userData.id),  // ID of the user whose password is being reset
                    new_password: newPassword,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Password reset successful!");
                setNewPassword('')
                setIsLoading(false)
                setNowLoad(false)
            } else {
                setMessage(data.error || "Failed to reset password.");
                setIsLoading(false)
                setNowLoad(false)
            }
        } catch (error) {
            setMessage("Error resetting password.");
        }
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    return (

        <div>
            <Button variant="success" className="p-3" onClick={handleShow}>
                Change Password
            </Button>

            <Modal backdrop="static" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Reset   User Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        {
                            nowLoad ? <div style={{minHeight: '270px', display: 'flex', justifyContent: "center", alignItems: 'center'}}> <h3>Please Wait....</h3></div> :
                                <div id="change" className="ps-4 mt-4 ">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Username:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={userData.username}
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label fw-bold">New Password:</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter New Password"
                                        />
                                    </div>

                                    {message && <p className="mt-3 alert alert-info">{message}</p>}
                                </div>

                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <button type="submit" className="btn btn-primary p-2" onClick={handleAdminPasswordReset}>
                        Reset Password
                    </button>
                </Modal.Footer>
            </Modal>
        </div>

    );
}

export default AdminPasswordReset;
