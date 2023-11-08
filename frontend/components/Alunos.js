import React, { useState } from 'react'
import styles from '../styles/MeusDados.module.scss'; // Importe os estilos corretos
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import Loading from './Loading'
import CheckBox from './CheckBox';

const api = require('../services/api'); 

const Alunos = ({alunos, setCurrent, getAlunos, setAppointmentHistory, getUserAppointment}) => {
  const [nome, setNome] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);

  const toastConfig = {
    position: "top-left",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    closeButton: false
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    // Validações básicas
    if (!nome || !nascimento || !codigo) {
      toast.error('Preencha todos os campos', toastConfig);
      return;
    }

    try {
      const body = { nome: nome, data_nascimento: nascimento, codigo: codigo };
      await api.createAluno(body).then((res) => {
        getAlunos();
        setAppointmentHistory();                
        toast.success("Sucesso ao criar aluno", toastConfig);
      }).catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.detail || "Erro ao criar aluno", toastConfig);
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || "Erro ao criar aluno", toastConfig);
    }
    setLoading(false);
  };

  const handleDeleteAluno = async(id, active) => {
    setLoading(true);
    try {
      await api.deleteAluno(id).then(() => {
        getAlunos();
        getUserAppointment();
        if (active){
          toast.success("Aluno ativado com sucesso", toastConfig);
        }
        else{
          toast.success("Aluno inativado com sucesso", toastConfig);
        }
        
      }).catch((err) => {
        toast.error(err.response?.data?.detail || "Erro ao inativar aluno", toastConfig);
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || "Erro ao inativar aluno", toastConfig);
    }
    setLoading(false);
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
              <div className={styles['buttons']}>              
                <button className={styles['iniciar-button']} type="submit">Cadastrar</button>              
                <button className={styles['alunos']} onClick={() => { setCurrent("default") }}>Voltar</button>                            
              </div>              
            </div>             
          </div>        
        </form>
        <ToastContainer />
      </div>
        <div style={{"display":"flex", "justifyContent":"center", "marginTop":"40px", "position":"absolute", "width":"80%"}}>
          <Loading loading={loading}></Loading>
        </div>
        <h2 className={styles.header}>Alunos</h2>        
        <div className={styles['table-div']}>          
          <table className={styles['appointment-table']}>
            <thead>
              <tr>
                <th style={{width: "30%"}}>Aluno</th>
                <th style={{width: "20%"}}>Idade</th>
                <th style={{width: "30%"}}>Código</th>
                <th style={{width: "20%"}}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno, index) => (
                <tr key={index}>
                  <td>{aluno.nome}</td>
                  <td>{aluno.idade}</td>
                  <td>{aluno.codigo}</td>
                  <td>
                  <div className={styles['row']}>
                    <Link href={`/atendimento/${aluno.id}`}>
                      <button className={`${aluno.ativo ? styles["iniciar-button"] : styles["inativo-button"]}`} disabled={!aluno.ativo}>
                        {aluno.ativo ? "Iniciar atendimento" : "Iniciar atendimento"}
                      </button>
                    </Link>
                    <CheckBox
                      id="cbx-3"
                      checked={aluno.ativo}
                      onChangeFunction={(e) =>handleDeleteAluno(aluno.id, e)}
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

export default Alunos