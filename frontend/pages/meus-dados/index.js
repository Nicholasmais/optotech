import React, { useEffect, useState } from 'react';
import styles from '../../styles/MeusDados.module.scss'; // Importe os estilos corretos
import { useAuth } from '../../contexts/AuthContext';
import NavBar from '../../components/NavBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import Alunos from '../../components/Alunos';
import History from '../../components/History';
import MeusDadosComponent from '../../components/MeusDadosComponent';
import Loading from '../../components/Loading';

const api = require('../../services/api');

export default function MeusDados() {
  const { authData, setAuthData } = useAuth();

  let user = authData?.user?.user || '';
  let email = authData?.user?.email || '';

  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState("default");  

  const toastConfig = {
    position: "top-left", // Position of the toast
    autoClose: 3000,       // Auto close duration in milliseconds (set to false to disable auto close)
    hideProgressBar: false, // Show/hide the progress bar
    closeOnClick: true,     // Close the toast when clicked
    pauseOnHover: true,     // Pause auto close on hover
    draggable: true,        // Allow the toast to be dragged
    closeButton: false
  };

  const router = useRouter();

  const getAlunos = async() => {
    setLoading(true);
    await api.alunos().then((res) => {
      setAlunos(res);
    }).catch((err) => {
      toast.error(err.response?.data.detail, toastConfig);  
    })
    setLoading(false);
  }

  const getUserAppointment = async() => {
    await api.appointment().then((res) => {
      setAppointmentHistory(res);
    }).catch((err) => {
      toast.error(err.response?.data.detail, toastConfig);  
    })
  }
  
  useEffect(() => {
    user = authData?.user?.user || '';
    email = authData?.user?.email || '';
  }, [authData])

  useEffect(() =>{  
    const checkUser = async() => {
      await api.isAuth().then((res) => {
        setAuthData(res);
        if (!res.isAuth){
          router.push("/snellen");
        }
      }).catch((err) => {
        toast.error('Erro ao se conectar com servidor.', toastConfig);
      });
    }
    
    checkUser();
    getAlunos();
    getUserAppointment();

  }, []);

  const renderSwitch = (current) => {
    switch(current) {
      case 'default':
        return (<MeusDadosComponent 
          isOpenForm={isOpenForm}
          setIsOpenForm={setIsOpenForm}
          user={user}
          email={email}
          setCurrent={setCurrent}
          loading={loading}
          />);
      
      case 'alunos':
        return (<Alunos alunos={alunos} setCurrent={setCurrent} getAlunos={getAlunos} setAppointmentHistory={setAppointmentHistory}/>);
      
      case 'historico':
        return (<History appointmentHistory={appointmentHistory} setCurrent={setCurrent}/>);
      
      default:
        return (<></>);
    }
  }
 
  return (
      <>
      <NavBar style={{marginTop: "1rem"}}></NavBar>
      <ToastContainer />
      {
       renderSwitch(current)
      }      
    </>
  );
}
