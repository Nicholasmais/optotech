import React, { useEffect, useState } from 'react';
import LoginForm from '../../components/LoginForm.js';
import UserLoggedInForm from '../../components/UserLoggedInForm.js';
import { useAuth } from '../../contexts/AuthContext.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../../components/NavBar.js';
import Snellen from '../../components/Snellen.js';
const api = require('../../services/api.js');

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
    api.isAuth().then((res) => {
      if (!res.isAuth){
        api.removeItem("token");
      }
      const isLoggedIn = api.checkSessionCookie();
      setHasLoggedIn(isLoggedIn);
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
        hasLoggedIn ? ( isLoggedFormOpen ? ( 
          <UserLoggedInForm 
          setIsLoginFormOpen = {setIsLoginFormOpen}
          setHasLoggedIn = {setHasLoggedIn}
          setIsLoggedFormOpen = {setIsLoggedFormOpen}
          setHasTriedToLogIn = {setHasTriedToLogIn}
          />
          ) : null
        ) : 
          isLoginFormOpen ? (
            <LoginForm 
            setIsLoginFormOpen = {setIsLoginFormOpen}
            setHasLoggedIn = {setHasLoggedIn}
            setIsLoggedFormOpen = {setIsLoggedFormOpen}
            setHasTriedToLogIn = {setHasTriedToLogIn}
            />
          ) : null
        
      }
    </>
  );
}
