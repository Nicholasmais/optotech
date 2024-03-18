import React, { useState } from 'react'
import styles from '../styles/MeusDados.module.scss'; // Importe os estilos corretos
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './Loading'
import AddIcon from '../assets/add_icon.svg'
import RemoveIcon from '../assets/remove.svg'
import Image from 'next/image';
import { useRouter } from 'next/router';

const api = require('../services/api'); 

const Pacientes = ({pacientes, setCurrent, getPacientes, setAppointmentHistory, getUserAppointment, fetchReport}) => {
  const [nome, setNome] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [aditionalInfo, setAditionalInfo] = useState([]);
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toastConfig = {
    position: "top-left",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    closeButton: false
  };

  const checkAditionalInfo = () => {
    for (let info of aditionalInfo) {      
      if ((info?.key == null || info?.value == null) || (info?.key === '' || info?.value  === '')){
        return false;
      }
    }
    return true;
  }

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    // Validações básicas
    if (!nome || !nascimento || !codigo || !checkAditionalInfo()) {
      setLoading(false);
      toast.error('Preencha todos os campos', toastConfig);
      return;
    }

    try {
      const body = { nome: nome, data_nascimento: nascimento, codigo: codigo, aditional_info: aditionalInfo };
      await api.createPaciente(body).then((res) => {
        getPacientes();
        setAppointmentHistory();  
        fetchReport({});
        toast.success("Sucesso ao criar paciente", toastConfig);
      }).catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.detail || "Erro ao criar paciente", toastConfig);
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || "Erro ao criar paciente", toastConfig);
    }
    setLoading(false);
  };

  const addAditionalInfo = () => {
    setAditionalInfo([...aditionalInfo, {key: null, value: null}]);
  }

  const removeAditionalInfo = (index) => {   
    if (aditionalInfo.length > 0){
      setAditionalInfo([
        ...aditionalInfo.slice(0, index),
        ...aditionalInfo.slice(index + 1)
      ])
    }     
  }
  
  const updateAditionalInfo = (index, updatedInfo) => {
    setAditionalInfo([
      ...aditionalInfo.slice(0, index),
      updatedInfo,
      ...aditionalInfo.slice(index + 1)
    ]);
  }

  return (
    <>      
      <div className={styles['historico']}>
        <div className={styles['meus-dados-container']} style={{ marginTop: "-4rem", width: "60%" }}>
          <form onSubmit={handleSubmit}>
            <div className={styles['form-row']}>          
              <div className={styles['form-column']}>
                <div className={styles['form-group']}>
                  <label style={{ textAlign: "left" }}>Nome:</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>              
                <div className={styles['form-group']}>
                  <label style={{ textAlign: "left" }}>Data de Nascimento:</label>
                  <input
                    type="date"
                    onChange={(e) => setNascimento(e.target.value)}
                  />
                </div>              
              </div>            
              <div className={styles['form-column']}>
                <div className={styles['form-group']}>
                  <label style={{ textAlign: "left" }}>Código:</label>
                  <input
                    type="text"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                  />                     
                </div>
              </div>             
            </div>         
            <div className={styles["form-row"]}>
              <div className={styles['form-column']}>              
                <label style={{ textAlign: "left" }}>Campos Adicionais:</label>
                <div className={styles['form-column']} id='informacoes-adicionais'>          
                {aditionalInfo?.map((info, i) => (
                  <div className={styles['form-row']} key={`form-row-1-${i}`} style={{gap:'1rem'}}>
                    <div className={styles['form-group']} key={`form-group-1-${i}`}>
                      <label style={{ textAlign: "left", fontSize:"1.25rem" }} key={`label-1-${i}`}>Nome da informação:</label>
                      <input
                        type="text"
                        value={info.key || ''}
                        onChange={(e) => updateAditionalInfo(i, { ...info, key: e.target.value })}
                        key={`input-1-${i}`}
                        style={{fontSize:"1rem"}}
                      />
                    </div>
                    <div className={styles['form-group']} key={`form-row-2-${i}`}>
                      <label style={{ textAlign: "left", fontSize:"1.25rem"}} key={`label-2-${i}`}>Valor da informação:</label>
                      <div className={styles['form-row']} key={`form-row-1-${i}`}>
                        <input
                          type="text"
                          value={info.value || ''}
                          onChange={(e) => updateAditionalInfo(i, { ...info, value: e.target.value })}
                          key={`input-2-${i}`}
                          style={{fontSize:"1rem"}}
                        />
                        <Image
                          src={RemoveIcon}
                          alt="Remover informação adicional"
                          width={12}
                          height={12}
                          onClick={() => removeAditionalInfo(i)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                </div> 
              </div>            
            </div>
            <div className={styles['form-row']} style={{justifyContent:"center"}}>          
              <Image 
                src={AddIcon}
                alt="Adicionar informação adicional"
                width={12}
                height={12}
                onClick={()=>addAditionalInfo()}
              />
            </div>
            <div className={styles["form-row"]}>
              <div className={styles['form-column']}>
                <div className={styles['buttons']}>
                  <button className={styles['iniciar-button']} type="submit">Cadastrar</button>              
                  <button className={styles['pacientes']} onClick={() => { setCurrent("default") }}>Voltar</button>                            
                  <button className={styles['pacientes']} onClick={() => { router.push("/meus-dados/pacientes")}}>Ver pacientes</button>                            
                </div> 
              </div>                      
            </div>
          </form>
          <ToastContainer />
        </div>
        <div style={{"display":"flex", "justifyContent":"center", "marginTop":"40px", "position":"absolute", "width":"80%"}}>
          <Loading loading={loading}></Loading>
        </div>        
      </div>
    </>
  )
}

export default Pacientes