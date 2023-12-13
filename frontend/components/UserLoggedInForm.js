import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import styles from '../styles/Login.module.scss';
const api = require('../services/api');
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

function UserLoggedInForm({setIsLoginFormOpen, setHasLoggedIn, setIsLoggedFormOpen, setHasTriedToLogIn}) {
  const [isEditing, setIsEditing] = useState(false);
  const { authData, setAuthData } = useAuth();

  const user = authData?.user?.user || '';
  const email = authData?.user?.email || '';

  const [updatedUser, setUpdatedUser] = useState(user);
  const [updatedEmail, setUpdatedEmail] = useState(email);
  
  const router = useRouter();

  const toastConfig = {
    position: "top-left", // Position of the toast
    autoClose: 3000,       // Auto close duration in milliseconds (set to false to disable auto close)
    hideProgressBar: false, // Show/hide the progress bar
    closeOnClick: true,     // Close the toast when clicked
    pauseOnHover: true,     // Pause auto close on hover
    draggable: true,        // Allow the toast to be dragged
    closeButton: false
  };  

  const goTerms = () => {
    router.push('/');
  }

  const handleSaveClick = () => {    
    onUpdateUser(updatedUser, updatedEmail);
    setIsEditing(false);
  };

  const logout = () =>{
    api.logout().then((res) => {
      setAuthData({
        isAuth: false,
        user: {
          id: '',
          user: '',
          email: '',
          expirationDate: '',
        },
      });
      api.clearCookie();      
      setIsLoginFormOpen(false);
      setHasLoggedIn(false);
      setIsLoggedFormOpen(false);
      setHasTriedToLogIn(false);
      goTerms();
    })
  }

  return (
    <div className={styles.formContainer}>
      <ToastContainer />
      <h2>Bem-vindo, {user}!</h2>
      <p>Email: {email}</p>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={updatedUser}
            onChange={(e) => setUpdatedUser(e.target.value)}
          />
          <input
            type="email"
            value={updatedEmail}
            onChange={(e) => setUpdatedEmail(e.target.value)}
          />
          <button onClick={handleSaveClick}>Salvar</button>
        </div>
      ) : (
        <>
          <Link href="/meus-dados">
            <button>Meus dados</button>
          </Link>
          <button onClick={logout}>Sair</button>
        </>
      )}
      <button type="button" onClick={goTerms} >Ajuda</button>
    </div>
  );
}

export default UserLoggedInForm;
