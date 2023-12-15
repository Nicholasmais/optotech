import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import NavBar from '../../components/NavBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import Pacientes from '../../components/Pacientes';
import History from '../../components/History';
import MeusDadosComponent from '../../components/MeusDadosComponent';
import Estatistics from '../../components/Estatistics';

const api = require('../../services/api');

export default function MeusDados() {
  const { authData, setAuthData } = useAuth();
  
  const distanceToRead = (pixel) => {      
    return ((pixel * 25.4) / (5 * Math.tan(Math.PI / 10800) * 1000 * dpi)).toFixed(1);
  }

  let user = authData?.user?.user || '';
  let email = authData?.user?.email || '';
  let dpi = authData?.user?.dpi || 96;
  let distance = authData?.user?.distancia || 6.1;

  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState("default");  

  const [visualAcuityComparison, setVisualAcuityComparison] = useState({
    "superior" : null,
    "igual" : null,
    "inferior" : null
  })

  const [activeUnactive, setActiveUnactive] = useState({
    "patient" : null,
    "appointment" : null    
  })  

  const [demographic, setDemographic] = useState([])
  const [patientAppointments, setPatientAppointments] = useState([])
  const [mostDate, setMostDate] = useState({})

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

  const getPacientes = async() => {
    setLoading(true);
    await api.pacientes().then((res) => {
      setPacientes(res);
    }).catch((err) => {
      toast.error(err.response?.data?.detail, toastConfig);  
    })
    setLoading(false);
  }

  const getUserAppointment = async() => {
    await api.appointment().then((res) => {
      setAppointmentHistory(res);
    }).catch((err) => {
      toast.error(err.response?.data?.detail, toastConfig);  
    })
  }
  
  const fetchReport = async(body) => {
    await api.reportComparison(body).then((res) => {
      setVisualAcuityComparison(res);
    });
    await api.reportActive(body).then((res) => {
      setActiveUnactive(res);
    });
    await api.reportDemographic(body).then((res) => {
      setDemographic(res);
    });
    await api.reportPatientAppointments(body).then((res) => {
      setPatientAppointments(res);
    });
    await api.reportMaxMinDate().then((res) => {
      setMostDate(res);
    });
  }  

  useEffect(() => {
    user = authData?.user?.user || '';
    email = authData?.user?.email || '';
    dpi = authData?.user?.dpi || '';
    distance = authData?.user?.distancia || '';
  }, [authData])
  
  useEffect(() =>{  
    const checkUser = async() => {
      await api.isAuth().then((res) => {
        setAuthData(res);
        if (!res.isAuth){
          router.push("/");
        }
      }).catch((err) => {
        toast.error('Erro ao se conectar com servidor.', toastConfig);
      });
    }    

    fetchReport({});    
    checkUser();
    getPacientes();
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
          dpi={dpi}
          distance={distance}
          setCurrent={setCurrent}
          loading={loading}
          />);
      
      case 'pacientes':
        return (<Pacientes pacientes={pacientes} setCurrent={setCurrent} getPacientes={getPacientes} setAppointmentHistory={setAppointmentHistory} getUserAppointment={getUserAppointment} fetchReport={fetchReport}/>);
      
      case 'historico':
        return (<History appointmentHistory={appointmentHistory} setCurrent={setCurrent}/>);
      
      case 'estatisticas':
        return (<Estatistics setCurrent={setCurrent} 
                visualAcuityComparison={visualAcuityComparison}
                activeUnactive={activeUnactive}
                demographic={demographic}
                mostDate={mostDate}
                fetchReport={fetchReport}
                userPatients={pacientes}
                patientAppointments={patientAppointments}
                />);
    
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
