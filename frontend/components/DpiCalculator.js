import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/DPI.module.scss'
const api = require('../services/api');
import { useRouter } from 'next/router';
import Loading from './Loading';

function DpiCalculator() {
  const { authData, setAuthData } = useAuth();
  const [dpi, setDPI] = useState(authData?.user?.dpi || null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [diagonal, setDiagonal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const toastConfig = {
    position: "top-left", // Position of the toast
    autoClose: 3000,       // Auto close duration in milliseconds (set to false to disable auto close)
    hideProgressBar: false, // Show/hide the progress bar
    closeOnClick: true,     // Close the toast when clicked
    pauseOnHover: true,     // Pause auto close on hover
    draggable: true,        // Allow the toast to be dragged
    closeButton: false,
    toastId: 'check'
  };

  const calculateDpi = (e) => {
    e?.preventDefault();
    const widthPixels = parseInt(width, 10);
    const heightPixels = parseInt(height, 10);
    const diagonalInches = parseFloat(diagonal);

    if (!isNaN(widthPixels) && !isNaN(heightPixels) && !isNaN(diagonalInches)) {
      const dpiValue = Math.sqrt(widthPixels ** 2 + heightPixels ** 2) / diagonalInches;
      setDPI(dpiValue.toFixed(0));
    }
  };

  const saveDpi = async(e) => {
    e.preventDefault();
    setIsLoading(true);
    await api.saveDpi(
      {
        dpi:dpi
      }).then((res)=>{
        toast.success('Sucesso ao registrar DPI.', toastConfig);      
      }).catch((e)=>{
        console.log(e);
        toast.error(err.response?.data?.detail || 'Erro ao ao salvar DPI.', toastConfig);
      });
    setIsLoading(false);
    await api.isAuth().then((res) => {
      setAuthData(res);
      if (!res.isAuth){
        router.push("/");
      }
    }).catch((err) => {
      console.log(err);
      toast.error(err.response?.data?.detail || 'Erro ao ao se conectar com servidor.', toastConfig);
      router.push("/");
    });    
  }

  useEffect(() => {
    calculateDpi();
  }, [width, height, diagonal])

  return (    
    <form onSubmit={saveDpi} className={styles.form} style={{fontSize:"20px"}}>
      <div className={styles.divFlex}>
        <label>Largura (px):</label>
        <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
      </div>
      <div className={styles.divFlex}>
        <label>Altura (px):</label>
        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
      </div>
      <div className={styles.divFlex}>
        <label>Diagonal (polegadas):</label>
        <input type="number" value={diagonal} onChange={(e) => setDiagonal(e.target.value)} />
      </div>
      <div className={styles.divFlex}>
        <label>DPI:</label>
        <input type="number" value={dpi} onChange={(e) => setDPI(e.target.value)} />
      </div>
      {isLoading ? (
        <div className={styles.divFlex} style={{height:"50px", width:"100%", alignItems:"center", justifyContent:"center"}}>
          <Loading loading={isLoading}/>      
        </div>
      ) : null
      }      
      <button type="submit">Salvar DPI</button>
    </form>
  );
}

export default DpiCalculator;
