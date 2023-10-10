import React, { useEffect, useState } from 'react';
import styles from '../../styles/MeusDados.module.scss'; // Importe os estilos corretos
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import NavBar from '../../components/NavBar';
const api = require('../../services/api');

export default function MeusDados() {
  const { authData, setAuthData } = useAuth();
  const [user, setUser] = useState({
    user: authData?.user?.user || null,
    email: authData?.user?.email || null
  });

  const appointmentHistory = [
    {
      patientName: 'Maria Pereira',
      snellenVision: '20/20',
      age: 35,
      birthDate: '1988-05-15',
      appointmentTime: '2023-10-10T09:00:00',
    },
  ];  

  return (
      <>
      <NavBar style={{marginTop: "1rem"}}></NavBar>

      <div className={styles['meus-dados-container']}>
        <h1 className={styles.header}>Meus Dados</h1>

        <div className={styles['user-info']}>
          <p><strong>Nome:</strong> {user.user}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>

        <div className={styles['button-container']}>
          <button className={styles['alterar-button']}>Alterar Dados</button>
          <button className={styles['iniciar-button']}>Iniciar Atendimento</button>
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
              <th>Paciente</th>
              <th>Visão (20/20, 20/30, etc.)</th>
              <th>Idade</th>
              <th>Data de Nascimento</th>
              <th>Hora da Consulta</th>
            </tr>
          </thead>
          <tbody>
            {appointmentHistory.map((appointment, index) => (
              <tr key={index}>
                <td>{appointment.patientName}</td>
                <td>{appointment.snellenVision}</td>
                <td>{appointment.age}</td>
                <td>{appointment.birthDate}</td>
                <td>{appointment.appointmentTime}</td>
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

  console.log('user:', user); // Exibe o valor de user no console
  console.log('isAuth:', isAuth); // Exibe o valor de isAuth no console
  console.log(context.req.cookies);
  console.log(await api.isAuth())
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
