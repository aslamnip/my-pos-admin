import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { Fade, JackInTheBox } from 'react-awesome-reveal';
import { useNavigate } from 'react-router-dom';
import { AllContext } from '../../AllContext';
import { fetchUrl } from '../../config';
import styles from './Login.module.css';
import Loading from '../Loading/Loading';

function Login() {
    const navigation = useNavigate()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [token, setToken] = useState('')
    const [accessLogin, setAccessLogin] = useState(false)
    const { setShowAlert, setAlertText, setAlertVariant, setIslogIn } = useContext(AllContext)
   
    useEffect(() => {
        // Calculate the expiration time (23.5 hours)
        const expirationTime = new Date().getTime() + 23.5 * 60 * 60 * 1000;

        if (accessLogin) {
            // Save the access token and expiration time to localStorage
            localStorage.setItem('access_token', token);
            localStorage.setItem('expiration_time', expirationTime);


        }
    }, [accessLogin, token])


    const handleLogin = (e) => {
        e.preventDefault()
        setIsLoading(true)
        const LogInData = new FormData()
        LogInData.append('username', username)
        LogInData.append('password', password)

        fetch(`${fetchUrl}/api/login/token/`, {
            method: "POST",
            body: LogInData
        })
            .then(res => {
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000);
                if (res.ok) {
                   
                    setAccessLogin(true)
                    setIslogIn(true)
                }
                else {
                    setShowAlert(true);
                    setAlertText('Wrong Username or password');
                    setAlertVariant('danger');
                }
                return res.json()
            })
            .then(data => {
                const accessToken = data.access;
                setToken(accessToken)
                navigation('/')
            })

    }
    // const useAuth = ()=>isLogin

    //     if (useAuth) {
    //         return <Navigate to='/' />

    //     }

    return (
        <div className={styles.container}>
            {isLoading ? <Loading /> : null}
            <Fade direction='down'>
                <div className={`${styles.loginBox} ${styles.glowing}`}>
                    <h2><Fade delay={500} cascade >Login</Fade></h2>
                    <form onSubmit={handleLogin}>
                        <Fade direction='left' delay={500}>
                            <div className={`${styles.formGroup}`}>
                                <FontAwesomeIcon icon={faUser} className={styles.icon} />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className={`${styles.inputField}`}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </Fade>
                        <Fade direction='right' delay={500}>
                            <div className={`${styles.formGroup}`}>
                                <FontAwesomeIcon icon={faLock} className={styles.icon} />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className={`${styles.inputField}`}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </Fade>
                        <JackInTheBox direction='up' delay={1000}>
                            <input className={styles.submitButton} type="submit" value="Login" />
                        </JackInTheBox>
                    </form>
                </div>
            </Fade>
        </div>
    );
}

export default Login;
