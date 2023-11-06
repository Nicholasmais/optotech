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
  const alunoId = router.query.id;
  const [aluno, setAluno] = useState({});

  const toggleLoginForm = () => {
    setIsLoggedFormOpen(!isLoggedFormOpen);
  };


  useEffect(() => {
    const isLoggedIn = api.checkSessionCookie();
    setHasLoggedIn(isLoggedIn);

    if (!isLoggedIn) {
      router.push('/snellen');
    }

    api.isAuth().then((res) => {
      setAuthData(res);
    }).catch((err) => {
      toast.error('Erro ao se conectar com servidor.', toastConfig);
    });

  }, []);

  useEffect(() => {
    const fetchAluno = async(id) => {
      if (id === undefined) {return}
      await api.aluno(id).then((res) => {        
        setAluno(res);        
      }).catch((err) => {
        toast.error('Erro ao se conectar com servidor.', toastConfig);
      });
    }
    fetchAluno(alunoId);
  }, [alunoId]);

  return (
    <>
      <NavBar toggleLoginForm={toggleLoginForm} />

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
