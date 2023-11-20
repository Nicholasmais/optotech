import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../contexts/AuthContext';

const api = require('../services/api');

function DpiCalculator() {
  const { authData, setAuthData } = useAuth();

  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [diagonal, setDiagonal] = useState('');
  const [dpi, setDpi] = useState(authdata?.user.dpi);

  const toastConfig = {
    position: "top-left", // Position of the toast
    autoClose: 3000,       // Auto close duration in milliseconds (set to false to disable auto close)
    hideProgressBar: false, // Show/hide the progress bar
    closeOnClick: true,     // Close the toast when clicked
    pauseOnHover: true,     // Pause auto close on hover
    draggable: true,        // Allow the toast to be dragged
    closeButton: false
  };

  const calculateDpi = (e) => {
    e?.preventDefault();
    const widthPixels = parseInt(width, 10);
    const heightPixels = parseInt(height, 10);
    const diagonalInches = parseFloat(diagonal);

    if (!isNaN(widthPixels) && !isNaN(heightPixels) && !isNaN(diagonalInches)) {
      const dpiValue = Math.sqrt(widthPixels ** 2 + heightPixels ** 2) / diagonalInches;
      setDpi(dpiValue.toFixed(0));
    }
  };

  const saveDpi = async(e) => {
    e.preventDefault();
    await api.saveDpi(
      {
        dpi:dpi
      }).then((res)=>{
        console.log(res);                                                   
      }).catch((e)=>{
        console.log(e);
      });
    await api.isAuth().then((res) => {
      setAuthData(res);
      if (!res.isAuth){
        router.push("/snellen");
      }
    }).catch((err) => {
      console.log(err);
      toast.error('Erro ao se conectar com servidor.', toastConfig);
    });  
  }

  useEffect(() => {
    calculateDpi();
  }, [width, height, diagonal])

  return (    
    <form onSubmit={saveDpi}>
      <ToastContainer/>
      <div>
        <label>Largura (px):</label>
        <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
      </div>
      <div>
        <label>Altura (px):</label>
        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
      </div>
      <div>
        <label>Diagonal (polegadas):</label>
        <input type="number" value={diagonal} onChange={(e) => setDiagonal(e.target.value)} />
      </div>
      <div>
        <label>DPI:</label>
        <input type="number" value={dpi} onChange={(e) => setDpi(e.target.value)} />
      </div>
      <button type="submit">Salvar DPI</button>
    </form>
  );
}

export default DpiCalculator;
