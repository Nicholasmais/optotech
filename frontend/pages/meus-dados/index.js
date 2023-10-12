import React, { useEffect, useState } from 'react';
import styles from '../../styles/MeusDados.module.scss'; // Importe os estilos corretos
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import NavBar from '../../components/NavBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const api = require('../../services/api');

export default function MeusDados() {
  const { authData, setAuthData } = useAuth();
  const [user, setUser] = useState({
    user: authData?.user?.user || null,
    email: authData?.user?.email || null
  });
  const [appointmentHistory, setAppointmentHistory] = useState([]);

  const toastConfig = {
    position: "top-left", // Position of the toast
    autoClose: 3000,       // Auto close duration in milliseconds (set to false to disable auto close)
    hideProgressBar: false, // Show/hide the progress bar
    closeOnClick: true,     // Close the toast when clicked
    pauseOnHover: true,     // Pause auto close on hover
    draggable: true,        // Allow the toast to be dragged
    closeButton: false
  };

  useEffect(() =>{
    const getUserAppointment = async() => {
      await api.appointment().then((res) => {
        setAppointmentHistory(res);
      }).catch((err) => {
        toast.error(err, toastConfig);
      })
    }
    getUserAppointment();
    api.isAuth().then((res) => {
      setAuthData(res);
      setUser({
        user: authData?.user?.user,
        email: authData?.user?.email
      });
    }).catch((err) => {
      toast.error('Erro ao se conectar com servidor.', toastConfig);
    });
  }, [])


  return (
      <>
      <NavBar style={{marginTop: "1rem"}}></NavBar>
      <ToastContainer />

      <div className={styles['meus-dados-container']}>
        <h1 className={styles.header}>Meus Dados</h1>

        <div className={styles['user-info']}>
          <p><strong>Nome:</strong> {user.user}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>

        <div className={styles['button-container']}>
          <button className={styles['alterar-button']}>Alterar Dados</button>
          <Link href="/atendimento">
            <button className={styles['iniciar-button']}>Iniciar Atendimento</button>
          </Link>
          <Link href="/">
            <button className={styles.backButton}>Voltar</button>
          </Link>
        </div>

        <hr />
      </div>

      <div className={styles['historico']}>
        <h2 className={styles.header}>Histórico de Atendimentos</h2>
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
    </>
  );
}

export async function getServerSideProps(context) {
  const { user, isAuth } = context.req.cookies; // Obtenha informações de autenticação a partir dos cookies


  if (isAuth) {
    return {
      redirect: {
        destination: '/', // Redirecione para a página inicial se não estiver autenticado
        permanent: false,
      },
    };
  }

  // Certifique-se de que `user` seja definido ou defina-o como `null`
  const userData = user || null;

  return {
    props: { user: userData },
  };
}
