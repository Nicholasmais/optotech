import styles from '../styles/ChangeArrow.module.scss';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
const api = require('../services/api');

const ChangeArrows = ({changeFunction}) => {
  const { authData, setAuthData } = useAuth();

  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  const [acuity, setAcuity] = useState(4);
  const [calculatedAcuity, setCalculatedAcuity] = useState(""); // State to hold calculated acuity

  const toastConfig = {
    position: 'top-left',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    closeButton: false,
  };

  const router = useRouter();
  const alunoId = router.query.id;
  const [aluno, setAluno] = useState({});

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const obj = {
      aluno: alunoId,
      acuidade: calculatedAcuity,        
    }

    await api.createAppointment(obj).then((res) => {
      toast.success('Sucesso ao salvar atendimento.', toastConfig);
    }).catch((err) => {
      console.log(err);
      toast.error(err.response.data?.detail || "Erro ao salvar atendimento", toastConfig);  
    })  
  }

  const calcuteAcuity = (val) =>{
    const lineNumber = parseInt(val);
    if (!isNaN(lineNumber) && lineNumber > 0) {
      setAcuity(val);
      let denominator;
      switch(lineNumber){          
        case 1:
          denominator = 200;
          break;
        case 2:
          denominator = 100;
          break;
        case 3:
          denominator = 70;
          break;
        case 4:
          denominator = 60;
          break;
        case 5:
          denominator = 40;
          break;
        case 6:
          denominator = 30;
          break;
        case 7:
          denominator = 25;
          break;
        default:
          denominator = 20;
          break
      }
      setCalculatedAcuity(`20/${denominator}`);
    } else {
      setCalculatedAcuity("");
    }
  }

  useEffect(() => {
    const isLoggedIn = api.checkSessionCookie();
    setHasLoggedIn(isLoggedIn);

    if (!isLoggedIn) {
      router.push('/');
    }

    api.isAuth().then((res) => {
      setAuthData(res);
    }).catch((err) => {
      toast.error('Erro ao se conectar com servidor.', toastConfig);
    });

    calcuteAcuity(acuity);
  }, []);

  useEffect(() => {
    const fetchAluno = async(id) => {
      if (id === undefined) {return}
      await api.aluno(id).then((res) => {        
        setAluno(res);        
      }).catch((err) => {
        toast.error('Erro ao se conectar com servidor.', toastConfig);
      });
    }
    fetchAluno(alunoId);
  }, [alunoId]);

  return (
    <div className={styles.preview} style={{flex:"1"}}>
      <ToastContainer />
      <div className={styles.change_active_row}>
        <div onClick={() => {
          changeFunction(-1);
        }}>
        </div>
        <div onClick={() => {
          changeFunction(1);
        }}>
        </div>
      </div>
      {aluno.id && (
        <div className={styles.formContainer}>
          <h3>Olá, {aluno.nome}</h3>          
          <form className={styles.form} onSubmit={handleFormSubmit}>
            <label htmlFor="line">Até qual linha você leu pelo menos metade?</label>
            <div className="row">
              <input
                type="number"
                name="line"
                id="line"
                placeholder="Digite o número da linha"
                value={acuity}
                onChange={(e) => calcuteAcuity(e.target.value)}
                className={''}
                min="1"
                max="8"
                step="1"
              />      
            
              <p>Acuidade estimada: {calculatedAcuity}</p>            
            </div>
            <button type="submit">Salvar atendimento</button>
          </form>
        </div>
      )}      
    </div>
  )
}

export default ChangeArrows