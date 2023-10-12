import React, { useEffect, useState } from 'react';
import styles from '../../styles/MeusDados.module.scss'; // Importe os estilos corretos
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import NavBar from '../../components/NavBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from '../../components/LoginForm';
import { useRouter } from 'next/router';

const api = require('../../services/api');

export default function MeusDados() {
  const { authData, setAuthData } = useAuth();

  let user = authData?.user?.user || '';
  let email = authData?.user?.email || '';

  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [isOpenForm, setIsOpenForm] = useState(false);

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

  useEffect(() => {
    user = authData?.user?.user || '';
    email = authData?.user?.email || '';
  }, [authData])

  useEffect(() =>{
    const getUserAppointment = async() => {
      await api.appointment().then((res) => {
        setAppointmentHistory(res);
      }).catch((err) => {
        toast.error(err.response.data.detail, toastConfig);  
      })
    }
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
    checkUser();
    getUserAppointment();

  }, [])


  return (
      <>
      <NavBar style={{marginTop: "1rem"}}></NavBar>
      <ToastContainer />

      <div className={styles['meus-dados-container']}>
        <h1 className={styles.header}>Meus Dados</h1>

        <div className={styles['user-info']}>
          <p><strong>Nome:</strong> {user}</p>
          <p><strong>Email:</strong> {email}</p>
        </div>

        <div className={styles['button-container']}>
          <button className={styles['alterar-button']} onClick={()=>setIsOpenForm(!isOpenForm)}>Alterar Dados</button>
          <Link href="/atendimento">
            <button className={styles['iniciar-button']}>Iniciar Atendimento</button>
          </Link>
          <Link href="/">
            <button className={styles.backButton}>Voltar</button>
          </Link>
        </div>

        <hr />
      </div>

      {isOpenForm && (
        <LoginForm isMeusDados={true} userObj={{user: user, email: email}} setIsOpenForm= {setIsOpenForm} isOpenForm = {isOpenForm}></LoginForm>
      )}

      <div className={styles['historico']}>
        <h2 className={styles.header}>Histórico de Atendimentos</h2>
        
        <div className={styles['table-div']}>
          <table className={styles['appointment-table']}>
            <thead>
              <tr>
                <th style={{width: "30%"}}>Paciente</th>
                <th style={{width: "20%"}}>Idade</th>
                <th style={{width: "30%"}}>Data do atendimento</th>
                <th style={{width: "20%"}}>Acuidade</th>
              </tr>
            </thead>
            <tbody>
              {appointmentHistory.map((appointment, index) => (
                <tr key={index}>
                  <td>{appointment.paciente}</td>
                  <td>{appointment.idade}</td>
                  <td>{appointment.data_atendimento}</td>
                  <td>{appointment.acuidade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
