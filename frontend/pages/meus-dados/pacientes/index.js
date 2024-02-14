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
  const [pacientes, setPacientes] = useState([]);
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

  const handleDeletePaciente = async(id, active) => {
    setLoading(true);
    try {
      await api.deletePaciente(id).then(() => {
        getPacientes();
        getUserAppointment();
        fetchReport({});
        if (active){
          toast.success("Paciente ativado com sucesso", toastConfig);
        }
        else{
          toast.success("Paciente inativado com sucesso", toastConfig);
        }        
      }).catch((err) => {
        toast.error(err.response?.data?.detail || "Erro ao inativar paciente", toastConfig);
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || "Erro ao inativar paciente", toastConfig);
    }
    setLoading(false);
  }

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
    getPacientes();
    getUserAppointment();
  }, []);

  return (
    <>
      <div className={styles['meus-dados-container']}>
        <div className={styles["form-row"]}>
          <div className={styles['form-column']}>
            <div className={styles['buttons']}>
              <button className={styles['pacientes']} onClick={() => { router.push("/meus-dados") }}>Voltar</button>                            
            </div> 
          </div>                      
        </div>
      </div>
      <div className={styles['historico']} style={{paddingTop:"0"}}>      
        <div style={{"display":"flex", "justifyContent":"center", "marginTop":"40px", "position":"absolute", "width":"80%"}}>
          <Loading loading={loading}></Loading>
        </div>
        <h2 className={styles.header}>Pacientes</h2>        
        <div className={styles['table-div']}>          
          <table className={styles['appointment-table']}>
            <thead>
              <tr>
                <th style={{width: "30%"}}>Paciente</th>
                <th style={{width: "20%"}}>Idade</th>
                <th style={{width: "30%"}}>Código</th>
                <th style={{width: "20%"}}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente, index) => (
                <tr key={index} >
                  <td onClick={() => {router.push(`/meus-dados/pacientes/${paciente.id}`)}}>{paciente.nome}</td>
                  <td onClick={() => {router.push(`/meus-dados/pacientes/${paciente.id}`)}}>{paciente.idade}</td>
                  <td onClick={() => {router.push(`/meus-dados/pacientes/${paciente.id}`)}}>{paciente.codigo}</td>
                  <td>
                  <div className={styles['row']}>
                    <Link href={`/atendimento/${paciente.id}`}>
                      <button className={`${paciente.ativo ? styles["iniciar-button"] : styles["inativo-button"]}`} disabled={!paciente.ativo}>
                        {paciente.ativo ? "Iniciar atendimento" : "Iniciar atendimento"}
                      </button>
                    </Link>
                    <CheckBox
                      id={`paciente-${index}`}
                      checked={paciente.ativo}
                      onChangeFunction={(e) =>handleDeletePaciente(paciente.id, e)}
                    />     
                  </div>
                  </td>
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