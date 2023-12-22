import React from 'react'
import styles from '../styles/NavBar.module.scss';
import logo from '../assets/logo.png';
import user from '../assets/user.png';
import arrow from '../assets/go-back.png';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PatientInfo from './PatientInfo';

const NavBar = ({toggleLoginForm, style, goBack, patientInfo}) => {
  return (
    <div className={styles.navbar} style={style} id='top-view'>
      <div className={styles.logoContainer}>
        <img src={logo.src} alt="Logo" className={styles.logo} />
      </div>
      {toggleLoginForm ? (
        <>
          <div className={styles.user} onClick={toggleLoginForm}>
            <img src={user.src} alt="User" className={styles.user} />
          </div>
          {patientInfo && <PatientInfo patientInfo={patientInfo} />}
        </>
      ) : goBack ? (
        <div className={styles.user} onClick={goBack}>
          <img src={arrow.src} alt="Arrow" className={styles.arrow} />
        </div>
      ) : null}
      
    </div>
  )
}

export default NavBar