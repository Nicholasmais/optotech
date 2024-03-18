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

  const [isLoggedFormOpen, setIsLoggedFormOpen] = useState(false);
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);

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
  const pacienteId = router.query.id;
  const [paciente, setPaciente] = useState({});

  const toggleLoginForm = () => {
    setIsLoggedFormOpen(!isLoggedFormOpen);
  };


  useEffect(() => {
    const isLoggedIn = authData?.isAuth;
    setHasLoggedIn(isLoggedIn);

    if (!isLoggedIn) {
      router.push('/');
    }

    api.isAuth().then((res) => {
      setAuthData(res);
    }).catch((err) => {
      console.log(err);
      toast.error(err.response?.data?.detail || 'Erro ao ao se conectar com servidor.', toastConfig);
    });

  }, []);

  useEffect(() => {
    const fetchPaciente = async(id) => {
      if (id === undefined) {return}
      await api.paciente(id).then((res) => {        
        setPaciente(res);        
      }).catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.detail || 'Erro ao ao se conectar com servidor.', toastConfig);
      });
    }
    fetchPaciente(pacienteId);
  }, [pacienteId]);

  return (
    <>
      <NavBar toggleLoginForm={toggleLoginForm} patientInfo={paciente} />

      <div className={styles.contentContainer}>
        <Snellen />        
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
