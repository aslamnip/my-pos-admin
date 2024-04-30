/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { AllContext } from '../../AllContext';
import styles from './Alert.module.css'

function Alerts() {
    const { showAlert, setShowAlert, alertText, alertVariant } = useContext(AllContext)
    useEffect(() => {
        if (showAlert) {
            setTimeout(() => {
                setShowAlert(false)
            }, 2000);
        }
    }, [ showAlert])

    if (showAlert) {
        return (
            <div className={styles.alert}>
                <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
                    <p>
                        {alertText}
                    </p>
                </Alert>
            </div>
        );
    }
}

export default Alerts;