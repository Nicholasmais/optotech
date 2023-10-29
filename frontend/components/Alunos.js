import React, { useState } from 'react'
import styles from '../styles/MeusDados.module.scss'; // Importe os estilos corretos
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const api = require('../services/api'); 

const Alunos = ({alunos, setCurrent, getAlunos}) => {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [codigo, setCodigo] = useState('');

  const [showAuthMessage, setShowAuthMessage] = useState(false);

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
    e.preventDefault();

    // Validações básicas
    if (!nome || !idade || !codigo) {
      toast.error('Preencha todos os campos', toastConfig);
      return;
    }

    try {
      const body = { paciente: nome, idade: idade, codigo: codigo };
      await api.createAluno(body).then(() => {
        getAlunos();
      }).catch((err) => {
        toast.error(err.response.data.detail, toastConfig);
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.detail, toastConfig);
    }
  };

  return (
    <>      
      <div className={styles['historico']}>
      <div className={styles['meus-dados-container']} style={{ marginTop: "-4rem", width: "60%" }}>
        <form onSubmit={handleSubmit}>
          <div className={styles['form-row']}>
            <div className={styles['form-group']}>
              <label style={{ textAlign: "left" }}>Nome:</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className={styles['form-group']}>
              <label style={{ textAlign: "left" }}>Idade:</label>
              <input
                type="number"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
              />
            </div>
          </div>
          <div className={styles['form-row']}>
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
        </form>
        <ToastContainer />
      </div>


        <h2 className={styles.header}>Alunos</h2>
        
        <div className={styles['table-div']}>
          <table className={styles['appointment-table']}>
            <thead>
              <tr>
                <th style={{width: "30%"}}>Aluno</th>
                <th style={{width: "20%"}}>Idade</th>
                <th style={{width: "30%"}}>Código</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((appointment, index) => (
                <tr key={index}>
                  <td>{appointment.paciente}</td>
                  <td>{appointment.idade}</td>
                  <td>{appointment.codigo}</td>
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