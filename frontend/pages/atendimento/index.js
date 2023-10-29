import React, { useState, useEffect } from 'react';
import styles from '../../styles/Atendimento.module.scss';
import UserLoggedInForm from '../../components/UserLoggedInForm';
import { useAuth } from '../../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../../components/NavBar';
import Snellen from '../../components/Snellen';
import { useRouter } from 'next/router';

const api = require('../../services/api');

export default function Home() {
  const { authData, setAuthData } = useAuth();
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const [hasTriedToLogIn, setHasTriedToLogIn] = useState(false);

  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [isLoggedFormOpen, setIsLoggedFormOpen] = useState(false);

  const [user, setUser] = useState('');
  const [age, setAge] = useState('');
  const [acuity, setAcuity] = useState(1);
  const [calculatedAcuity, setCalculatedAcuity] = useState("20/200"); // State to hold calculated acuity

  const [isUserValid, setIsUserValid] = useState(true);
  const [isAgeValid, setIsAgeValid] = useState(true);

  const toastConfig = {
    position: 'top-left',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    closeButton: false,
  };

  const router = useRouter();

  const toggleLoginForm = () => {
    setIsLoggedFormOpen(!isLoggedFormOpen);
  };

  const validateUser = (user) => {
    const regex = /^(?!\s*$).+/;
    return regex.test(user);
  };

  const validateAge = (age) => {
    return !isNaN(age) && parseInt(age) > 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const isUserValid = validateUser(user);
    const isAgeValid = validateAge(age);

    setIsUserValid(isUserValid);
    setIsAgeValid(isAgeValid);
    
    if (isUserValid && isAgeValid){
      const obj = {
        paciente: user,
        acuidade: calculatedAcuity,
        idade: age
      }

      await api.createAppointment(obj).then((res) => {
        toast.success('Sucesso ao salvar atendimento.', toastConfig);
      }).catch((err) => {
        console.log(err);
        toast.error(err.response.data.detail, toastConfig);  
      })
    }
  }

  const calcuteAcuity =(val) =>{
    const lineNumber = parseInt(val);
    if (!isNaN(lineNumber) && lineNumber > 0) {
      setAcuity(val);
      let denominator;
      switch(lineNumber){          
        case 1:
          denominator = 200;
          break;
        case 2:
          denominator = 100;
          break;
        case 3:
          denominator = 70;
          break;
        case 4:
          denominator = 50;
          break;
        case 5:
          denominator = 40;
          break;
        default:
          denominator = 20;
          break
      }
      setCalculatedAcuity(`20/${denominator}`);
    } else {
      setCalculatedAcuity("");
    }
  }

  useEffect(() => {
    const isLoggedIn = api.checkSessionCookie();
    setHasLoggedIn(isLoggedIn);

    if (!isLoggedIn) {
      router.push('/');
    }
    api.isAuth().then((res) => {
      setAuthData(res);
    }).catch((err) => {
      toast.error('Erro ao se conectar com servidor.', toastConfig);
    });
  }, []);

  return (
    <>
      <NavBar toggleLoginForm={toggleLoginForm} />

      <div className={styles.contentContainer}>
        <Snellen />

        <div className={styles.formContainer}>
          <h2 className={styles.heading}>Preencha os Detalhes</h2>
          <form className={styles.form} onSubmit={handleFormSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Nome"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className={!isUserValid ? 'invalid' : ''}
            />
            {!isUserValid && (
              <div className={styles.error}>Nome deve ter pelo menos 1 caractere</div>
            )}

            <input
              type="number"
              name="age"
              placeholder="Idade"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className={!isAgeValid ? 'invalid' : ''}
            />
            {!isAgeValid && (
              <div className={styles.error}>Idade deve ser um número positivo</div>
            )}

            <label htmlFor="line">Até qual linha você leu pelo menos metade?</label>
            <input
              type="number"
              name="line"
              id="line"
              placeholder="Digite o número da linha"
              value={acuity}
              onChange={(e) => calcuteAcuity(e.target.value)}
              className={''}
              min="1"
              max="5"
              step="1"
            />      
           
            <p>Acuidade estimada: {calculatedAcuity}</p>            

            <button type="submit">Enviar</button>
          </form>
        </div>
      </div>

      {hasLoggedIn ? (isLoggedFormOpen ? (
        <UserLoggedInForm
          setIsLoginFormOpen={setIsLoginFormOpen}
          setHasLoggedIn={setHasLoggedIn}
          setIsLoggedFormOpen={setIsLoggedFormOpen}
          setHasTriedToLogIn={setHasTriedToLogIn}
        />
      ) : null) : null}
    </>
  );
}
