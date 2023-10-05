import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/Login.module.scss';
const api = require('../services/api');

function UserLoggedInForm() {
  const [isEditing, setIsEditing] = useState(false);
  const { authData, setAuthData } = useAuth();

  const user = authData?.user?.user || '';
  const email = authData?.user?.email || '';

  const [updatedUser, setUpdatedUser] = useState(user);
  const [updatedEmail, setUpdatedEmail] = useState(email);

  const handleUpdateClick = () => {
    setIsEditing(true);
  };

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
    })
  }

  return (
    <div className={styles.formContainer}>
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
          <button onClick={handleUpdateClick}>Meus dados</button>
          <button onClick={logout}>Sair</button>
        </>
      )}
    </div>
  );
}

export default UserLoggedInForm;
