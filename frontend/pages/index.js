import styles from '../styles/Home.module.scss';
import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import user from '../assets/user.png';
import LoginForm from '../components/LoginForm.js';
import UserLoggedInForm from '../components/UserLoggedInForm';
import { useAuth } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../components/NavBar';
const api = require('../services/api');

export default function Home() {
  const { authData, setAuthData } = useAuth();
  const [activeRow, setActiveRow] = useState(0);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const [hasTriedToLogIn, setHasTriedToLogIn] = useState(false);

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

  const toastConfig = {
    position: "top-left", // Position of the toast
    autoClose: 3000,       // Auto close duration in milliseconds (set to false to disable auto close)
    hideProgressBar: false, // Show/hide the progress bar
    closeOnClick: true,     // Close the toast when clicked
    pauseOnHover: true,     // Pause auto close on hover
    draggable: true,        // Allow the toast to be dragged
    closeButton: false
  };

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
    (hasLoggedIn && hasTriedToLogIn) ?
      toast.success('Usuário logado com sucesso!', toastConfig) 
      :
      hasTriedToLogIn ? 
        toast.error('Credenciais inválidas!', toastConfig)
        :
        null;    
  }, [hasLoggedIn]);

  useEffect(() => {    
    const isLoggedIn = api.checkSessionCookie();
    setHasLoggedIn(isLoggedIn);
  
    api.isAuth().then((res) => {
      setAuthData(res);      
    })
  }, []);
  

  return (
    <>
    <NavBar toggleLoginForm={toggleLoginForm}></NavBar>
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
        <LoginForm 
        setIsLoginFormOpen = {setIsLoginFormOpen}
        setHasLoggedIn = {setHasLoggedIn}
        setIsLoggedFormOpen = {setIsLoggedFormOpen}
        setHasTriedToLogIn = {setHasTriedToLogIn}
        />
      ) : null}
      {hasLoggedIn ? ( isLoggedFormOpen ? ( 
        <UserLoggedInForm 
        setIsLoginFormOpen = {setIsLoginFormOpen}
        setHasLoggedIn = {setHasLoggedIn}
        setIsLoggedFormOpen = {setIsLoggedFormOpen}
        setHasTriedToLogIn = {setHasTriedToLogIn}
        />
        ) : null
      ) : null}
    </>
  );
}
