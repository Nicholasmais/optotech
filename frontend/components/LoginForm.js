import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from '../styles/Login.module.scss';
const api = require('../services/api'); 

function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [isUserValid, setIsUserValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isConfirmedPasswordValid, setIsConfirmedPasswordValid] = useState(true); 
  const [isRegistered, setIsRegistered] = useState(false);
  const toastConfig = {
    position: "top-left", // Position of the toast
    autoClose: 3000,       // Auto close duration in milliseconds (set to false to disable auto close)
    hideProgressBar: false, // Show/hide the progress bar
    closeOnClick: true,     // Close the toast when clicked
    pauseOnHover: true,     // Pause auto close on hover
    draggable: true,        // Allow the toast to be dragged
    closeButton: false
  };
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setUser('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setIsUserValid(true);
    setIsEmailValid(true);
    setIsPasswordValid(true);
    setIsConfirmedPasswordValid(true);
    setIsRegistered(false); 
  };

  const validateUser = (user) => {
    const regex = /^(?![\s\S]*\s)[A-Z]{6,}$/;
    return regex.test(user);
  }
  
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const isUserValid = validateUser(user);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    setIsUserValid(isUserValid);
    setIsEmailValid(isEmailValid);
    setIsPasswordValid(isPasswordValid);

    if (isLogin) {
      // Se for login, verifique apenas o email e senha
      if (isEmailValid && isPasswordValid) {
        const body = {
          email:email,
          password:password
        }
        api.checkLogin(body).then((res) => {
          setIsRegistered(true);
          toast.success('Usuário logado com sucesso!', toastConfig);
        }).catch(erro => {
          toast.error('Credenciais inválidas!', toastConfig);
          console.log(erro);
          setIsRegistered(false);
        })
      } else {
        setIsRegistered(false);
      }
    } else {
      const passwordsMatch = password === confirmPassword;
      setIsConfirmedPasswordValid(passwordsMatch);

      if (isEmailValid && isPasswordValid && passwordsMatch) {
        setIsRegistered(true);
      } else {
        setIsRegistered(false);
      }
    }
  };

  return (
    <div className={styles.formContainer}>
      <ToastContainer />
      <h2>{isLogin ? 'Login' : 'Cadastro'}</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          {isLogin ? null : (
             <div>
              <label>Usuário:</label>             
              <input
                type="user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className={!isUserValid ? 'invalid' : ''}
              />
              {!isUserValid && (
                <div className={styles.error}>Usuário deve ter pelo menos 6 caracteres</div>
              )}
             </div>
            )}
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={!isEmailValid ? 'invalid' : ''}
          />
          {!isEmailValid && (
            <div className={styles.error}>Email inválido</div>
          )}
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={!isPasswordValid ? 'invalid' : ''}
          />
          {!isPasswordValid && (
            <div className={styles.error}>Senha deve ter pelo menos 6 caracteres</div>
          )}
        </div>
        {isLogin ? null : (
          <div>
            <label>Confirmar Senha:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={!isConfirmedPasswordValid ? 'invalid' : ''}
            />
            {!isConfirmedPasswordValid && (
              <div className={styles.error}>As senhas não coincidem</div>
            )}
          </div>
        )}
        <button type="submit">{isLogin ? 'Entrar' : 'Cadastrar'}</button>
      </form>
      <button
        className={styles.button}
        onClick={toggleForm}
      >
        {isLogin ? 'Criar Conta' : 'Já tem uma conta? Login'}
      </button>

      {isRegistered && (
        <>
          <p className={styles.success}>
            {isLogin ? 'Logado com sucesso!' : 'Registro criado com sucesso!'}
          </p>
          <button onClick={() => {api.checkedLogged()}}>Teste</button>
        </>
      )}
    </div>
  );}

export default LoginForm;
