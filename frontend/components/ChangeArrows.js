import styles from '../styles/ChangeArrow.module.scss';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import Loading from './Loading';
const api = require('../services/api');

const ChangeArrows = ({changeFunction, maxInput, elementId = null}) => {
  const { authData, setAuthData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  const [leftAcuity, setLeftAcuity] = useState(8);
  const [rightAcuity, setRightAcuity] = useState(8);
  const [calculatedLeftAcuity, setCalculatedLeftAcuity] = useState("");
  const [calculatedRightAcuity, setCalculatedRightAcuity] = useState("");

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
  const pacienteId = router.query.id;
  const [paciente, setPaciente] = useState({});

  const handleFormSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    
    const obj = {
      paciente: pacienteId,
      acuidade: `${calculatedLeftAcuity}.${calculatedRightAcuity}`,        
    }

    await api.createAppointment(obj).then((res) => {
      toast.success('Sucesso ao salvar atendimento.', toastConfig);
    }).catch((err) => {
      console.log(err);
      toast.error(err.response?.data?.detail || "Erro ao salvar atendimento", toastConfig);  
    });
    setLoading(false);
  }

  const calculateLeftAcuity = (val) =>{
    const lineNumber = parseInt(val);
    if (!isNaN(lineNumber) && lineNumber > 0) {
      setLeftAcuity(val);
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
        case 8:
          denominator = 20;
          break
      case 9:
        denominator = 15;
          break
        default :
          denominator = 20;
          break
      }
      setCalculatedLeftAcuity(`20/${denominator}`);
    } else {
      setCalculatedLeftAcuity("");
    }
  }

  const calculateRightAcuity = (val) =>{
    const lineNumber = parseInt(val);
    if (!isNaN(lineNumber) && lineNumber > 0) {
      setRightAcuity(val);
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
        case 8:
          denominator = 20;
          break
      case 9:
        denominator = 15;
          break
        default :
          denominator = 20;
          break
      }
      setCalculatedRightAcuity(`20/${denominator}`);
    } else {
      setCalculatedRightAcuity("");
    }
  }

  function scrollIntoViewOnClick() {
    const elementoDeDestino = document.getElementById(elementId);
  
    if (elementoDeDestino) {
      elementoDeDestino.scrollIntoView({ behavior: 'smooth' });
    }
  }
    
  useEffect(() => {
    const isLoggedIn = api.checkSessionCookie();
    setHasLoggedIn(isLoggedIn);

    api.isAuth().then((res) => {
      setAuthData(res);
    }).catch((err) => {
      toast.error('Erro ao se conectar com servidor.', toastConfig);
    });

    calculateLeftAcuity(leftAcuity);
    calculateRightAcuity(rightAcuity);
  }, []);

  useEffect(() => {
    const fetchPaciente = async(id) => {
      if (id === undefined) {return}
        await api.paciente(id).then((res) => {        
          setPaciente(res);        
        }).catch((err) => {
          toast.error('Erro ao se conectar com servidor.', toastConfig);
        });
    }
    fetchPaciente(pacienteId);
  }, [pacienteId]);

  return (
    <div className={styles.preview} style={{flex:"1"}}>
      <ToastContainer />
      <div className={styles.change_active_row}>
        <div onClick={() => {
          changeFunction(-1);
          scrollIntoViewOnClick();
        }}>
        </div>
        <div onClick={() => {
          changeFunction(1);
          scrollIntoViewOnClick();
        }}>
        </div>
      </div>
      {paciente.id && (
        <div className={styles.formContainer}>
          <form className={styles.form} onSubmit={handleFormSubmit}>
            <label htmlFor="line">Até qual linha você leu pelo menos metade com seu olho esquerdo?</label>
            <div className="row">
              <input
                type="number"
                name="line"
                id="line"
                placeholder="Digite o número da linha"
                value={leftAcuity}
                onChange={(e) => calculateLeftAcuity(e.target.value)}
                className={''}
                min="1"
                max={maxInput}
                step="1"
              />      
            
              <p>Acuidade estimada: {calculatedLeftAcuity}</p>            
            </div>            
            <label htmlFor="line">Até qual linha você leu pelo menos metade com seu olho direito?</label>
            <div className="row">
              <input
                type="number"
                name="line"
                id="line"
                placeholder="Digite o número da linha"
                value={rightAcuity}
                onChange={(e) => calculateRightAcuity(e.target.value)}
                className={''}
                min="1"
                max={maxInput}
                step="1"
              />                      
              <p>Acuidade estimada: {calculatedRightAcuity}</p>            
            </div>
            <Loading loading={loading}></Loading>
            <button type="submit">Salvar atendimento </button>          
          </form>          
        </div>
      )}      
    </div>
  )
}

export default ChangeArrows