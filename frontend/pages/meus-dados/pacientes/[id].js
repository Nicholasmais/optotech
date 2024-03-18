import React, { useEffect, useState } from 'react';
import styles from '../../../styles/MeusDados.module.scss'; // Importe os estilos corretos
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import Loading from '../../../components/Loading'
import CheckBox from '../../../components/CheckBox';
import { useRouter } from 'next/router';
import { useAuth } from '../../../contexts/AuthContext';

const api = require('../../../services/api'); 

const Pacientes = () => {
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState({});
  const { authData, setAuthData } = useAuth();

  const toastConfig = {
    position: "top-left",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    closeButton: false
  };

  const router = useRouter();
  const patientId =router.query.id;

  const getPaciente = async() => {
    if (!patientId){
      return
    }

    setLoading(true);
    await api.paciente(patientId).then((res) => {      
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

  const checkUser = async() => {
    await api.isAuth().then((res) => {
      setAuthData(res);
      if (!res.isAuth){
        router.push("/");
      }
    }).catch((err) => {
      console.log(err);
      router.push("/");
      toast.error(err.response?.data?.detail || 'Erro ao ao se conectar com servidor.', toastConfig);
    });
  }    

  useEffect(() =>{   
    checkUser();
    getUserAppointment();
  }, []);

  
  useEffect(() =>{  
    getPaciente();
  }, [patientId]);

  return (
    <>
      <div className={styles['meus-dados-container']}>
        <div className={styles["form-row"]}>
          <div className={styles['form-column']}>
            <div className={styles['buttons']}>
              <button className={styles['pacientes']} onClick={() => { router.push("/meus-dados/pacientes/") }}>Voltar</button>                            
            </div> 
          </div>                      
        </div>
      </div>
      <div className={styles['historico']} style={{paddingTop:"4rem"}}>      
        <div style={{"display":"flex", "justifyContent":"center", "marginTop":"40px", "position":"absolute", "width":"80%"}}>
          <Loading loading={loading}></Loading>
        </div>
        <div className={styles['table-div']}>          
          <table className={styles['appointment-table']}>            
            <tbody>
              <tr>
                <td colspan="1"><b>Nome</b></td>
                <td colspan="1">{pacientes.nome}</td>                 
              </tr>
              <tr>
                <td><b>Data de nascimento</b></td>
                <td>{pacientes.data_nascimento}</td>                 
              </tr>
              <tr>
                <td><b>Código</b></td>
                <td>{pacientes.codigo}</td>
              </tr>
              <tr>
                <td colspan="2"><b>Informações Adicionais</b></td>
              </tr>
              {pacientes?.aditional_info?.map((aditional_info, index) => (
                <tr key={index}>
                  <td><b>{aditional_info.key}</b></td>
                  <td>{aditional_info.value}</td>                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Pacientes