import React, { useState } from 'react';
import { useAuth  } from '../contexts/AuthContext';
import styles from '../styles/Login.module.scss';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

const api = require('../services/api'); 

function LoginForm({setIsLoginFormOpen, setHasLoggedIn, setIsLoggedFormOpen, setHasTriedToLogIn, isMeusDados, userObj}) {
  const { setAuthData } = useAuth(); 
  const [isLogin, setIsLogin] = useState(isMeusDados ? !isMeusDados : true);
  const [user, setUser] = useState(userObj ? userObj.user : '');
  const [email, setEmail] = useState(userObj ? userObj.email : '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [isUserValid, setIsUserValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isConfirmedPasswordValid, setIsConfirmedPasswordValid] = useState(true); 
  const [showAuthMessage, setShowAuthMessage] = useState(false); // Novo estado para mostrar a mensagem de autenticação
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
    setShowAuthMessage(false); // Limpa a mensagem de autenticação ao alternar o formulário
  };

  const validateUser = (user) => {
    const regex = /^(?!\s*$).+/;
    return regex.test(user);
  }
  
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const isUserValid = validateUser(user);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    setIsUserValid(isUserValid);
    setIsEmailValid(isEmailValid);
    setIsPasswordValid(isPasswordValid);

    if (isLogin) {
      if (isEmailValid && isPasswordValid) {
        const body = {
          email: email,
          password: password
        };   
        try {
          await api.login(body).then((res) => {
            setShowAuthMessage(true);
            router.push(res.url);            
          }).catch((err) => {
            toast.error(err.response.data.detail, toastConfig);  
          });
        } catch (error) {
          console.error(error);
          toast.error(error.response.data.detail, toastConfig);  
        }
        setHasTriedToLogIn(true);            
      }
    } else {
      const passwordsMatch = password === confirmPassword;

      setIsConfirmedPasswordValid(passwordsMatch);

      if (isEmailValid && isPasswordValid && passwordsMatch) {
        const body = {
          user: user,
          email: email,
          password: password
        };
        if (!isMeusDados){
          await api.signup(body).then((res) => {
            setShowAuthMessage(true);
            setIsLoginFormOpen(true);
            setHasLoggedIn(false);
            setIsLoggedFormOpen(false);
            toggleForm();
            setIsLogin(true);
            toast.success("Registro realizado com sucesso.", toastConfig);  
          }).catch((error) => {
            console.error(error);  
            toast.error(error.response.data.detail, toastConfig);  
          });
        }
        else{
          await api.updateData(body).then((res) => {
            setAuthData(res);
            setShowAuthMessage(true); 
            toast.success("Usuário atualizado com sucesso.", toastConfig);  
          }).catch((error) => {
            console.error(error);  
            toast.error(error.response.data.detail, toastConfig);  
          });
        }
      }
    }
  }

  return (
    <div className={styles.formContainer}>
      <ToastContainer />
      <h2>{isLogin ? 'Login' : 'Cadastro'}</h2>
      <form onSubmit={handleFormSubmit}>
        {isLogin ? null : (
          <div>
            <label>Nome:</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className={!isUserValid ? 'invalid' : ''}
            />
            {!isUserValid && (
              <div className={styles.error}>Nome deve ter pelo menos 1 caractere</div>
            )}
          </div>
        )}
        <div>
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
        <button type="submit">{isLogin ? 'Entrar' : isMeusDados ? 'Atualizar' : 'Cadastrar'}</button>
      </form>
      {
        isMeusDados ?
          null
          :
          <button
            className={styles.button}
            onClick={toggleForm}
          >
            {isLogin ? 'Criar Conta' : 'Já tem uma conta? Login'}
          </button>
      }
      
      {showAuthMessage && (
        <div className={styles.authMessage}>
          {isLogin ? 'Autenticado com sucesso!' : 'Registro realizado com sucesso!'}
        </div>
      )}
    </div>
  );
}

export default LoginForm;
