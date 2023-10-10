import React from 'react'
import styles from '../styles/NavBar.module.scss';
import logo from '../assets/logo.png';
import user from '../assets/user.png';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NavBar = ({toggleLoginForm, style}) => {
  return (
    <div className={styles.navbar} style={style}>
      <ToastContainer />
      <div className={styles.logoContainer}>
        <img src={logo.src} alt="Logo" className={styles.logo} />
      </div>
      {toggleLoginForm ?
        <div className={styles.user} onClick={toggleLoginForm}>
          <img src={user.src} alt="User" className={styles.user} />
        </div>
          :
        null
      }      
    </div>
  )
}

export default NavBar