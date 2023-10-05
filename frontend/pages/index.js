import styles from '../styles/Home.module.scss';
import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import user from '../assets/user.png';
import LoginForm from '../components/LoginForm.js';
import UserLoggedInForm from '../components/UserLoggedInForm';
import { useAuth } from '../contexts/AuthContext';
const api = require('../services/api');

export default function Home() {
  const { authData, setAuthData } = useAuth();
  const [activeRow, setActiveRow] = useState(0);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [isLoggedFormOpen, setIsLoggedFormOpen] = useState(false);

  const eLetterSize = 100;
  const snellen_letters = [
    {
      letters: ["E"],
      size: eLetterSize
    },
    {
      letters: ["F", "P"],
      size: eLetterSize * 0.8
    },
    {
      letters: ["T", "O", "Z"],
      size: eLetterSize * 0.6
    },
    {
      letters: ["L", "P", "E", "D"],
      size: eLetterSize * 0.4
    },
    {
      letters: ["P", "E", "C", "F", "D"],
      size: eLetterSize * 0.2
    }
  ];

  const toggleLoginForm = () => {
    if (hasLoggedIn){
      setIsLoggedFormOpen(!isLoggedFormOpen);
    }
    else{
      setIsLoginFormOpen(!isLoginFormOpen);
    }    
  };

  const changeActiveRow = (increment) => {
    (increment < 0 && activeRow === 0) || (increment > 0 && activeRow === snellen_letters.length - 1) ?
      null : setActiveRow(activeRow + increment);
  }

  useEffect(() => {    
    const isLoggedIn = api.checkSessionCookie();
    setHasLoggedIn(isLoggedIn);
    setIsLoginFormOpen(!isLoggedIn);
    api.isAuth().then((res) => {
      setAuthData(res);      
    })
  }, [authData]);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logoContainer}>
          <img src={logo.src} alt="Logo" className={styles.logo} />
        </div>
        <div className={styles.user} onClick={toggleLoginForm}>
          <img src={user.src} alt="User" className={styles.user} />
        </div>
      </nav>
      <div className={styles.switch}>
        <div className={styles.chart}>
          <span>
            Snellen
          </span>
        </div>
        <div className={styles.personalize}>
          <span>
            Personalize
          </span>
        </div>
      </div>
      <div className={styles.snellen}>
        <div className={styles.row_to_read} style={{ fontSize: `${snellen_letters[activeRow].size}px` }}>
          <span>
            {snellen_letters[activeRow].letters}
          </span>
        </div>
        <div className={styles.preview}>
          <div className={styles.change_active_row}>
            <div onClick={() => {
              changeActiveRow(-1);
            }}>
            </div>
            <div onClick={() => {
              changeActiveRow(1);
            }}>
            </div>
          </div>
          <div className={styles.all_letters}>
            {
              snellen_letters.map((row, index) => (
                <div key={index} style={{ fontSize: `${40}px` }}>
                  {row.letters}
                </div>
              )
              )}
          </div>
        </div>
      </div>
      {isLoginFormOpen ? (
        <LoginForm/>
      ) : null}
      {hasLoggedIn ? ( isLoggedFormOpen ? ( 
        <UserLoggedInForm/>
        ) : null
      ) : null}
    </>
  );
}
