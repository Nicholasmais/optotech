import React, { useEffect, useState } from 'react';
import LoginForm from '../components/LoginForm.js';
import UserLoggedInForm from '../components/UserLoggedInForm';
import { useAuth } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../components/NavBar';
import Snellen from '../components/Snellen';
const api = require('../services/api');

export default function Home() {
  const { authData, setAuthData } = useAuth();
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const [hasTriedToLogIn, setHasTriedToLogIn] = useState(false);

  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [isLoggedFormOpen, setIsLoggedFormOpen] = useState(false);

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
    }).catch((err) => {
      toast.error("Erro ao se conectar com servidor.", toastConfig)
    })
  }, []);
  

  return (
    <>
      <NavBar toggleLoginForm={toggleLoginForm}></NavBar>

      <Snellen></Snellen>

      {
        isLoginFormOpen ? (
          <LoginForm 
          setIsLoginFormOpen = {setIsLoginFormOpen}
          setHasLoggedIn = {setHasLoggedIn}
          setIsLoggedFormOpen = {setIsLoggedFormOpen}
          setHasTriedToLogIn = {setHasTriedToLogIn}
          />
        ) : null
      }

      {
        hasLoggedIn ? ( isLoggedFormOpen ? ( 
          <UserLoggedInForm 
          setIsLoginFormOpen = {setIsLoginFormOpen}
          setHasLoggedIn = {setHasLoggedIn}
          setIsLoggedFormOpen = {setIsLoggedFormOpen}
          setHasTriedToLogIn = {setHasTriedToLogIn}
          />
          ) : null
        ) : null
      }
    </>
  );
}
