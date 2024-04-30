import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function DeleteModal(props) {
    const { iconText, warning, handlefunction } = props
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true)
    return (
        <div>
            <Button variant="primary" onClick={handleShow}>
                {iconText}
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton />
                <Modal.Body className='text-danger'>
                    {warning}
                </Modal.Body>

                <Modal.Footer>
                    <Button className='me-auto' variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handlefunction}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default DeleteModal;