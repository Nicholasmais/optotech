import React, { useState } from 'react';
import { useAuth  } from '../contexts/AuthContext';

const Calibration = () => {
  const { dpi, setDpi } = useAuth(); 

  const [mmSize, setmmSize] = useState(0);
  const [hasCalculatedDPI, setHasCalculatedDPI] = useState(false);
  const pxSize = 100;

  const handleCalculateDPI = () => {
    if (mmSize > 0) {
      const calculatedDPI = 25.4 * pxSize / (mmSize);
      setDpi(calculatedDPI);
      setHasCalculatedDPI(true);
    }
  };

  return (
    <div>
      <div style={{"display":"flex","alignItems":"center","flexDirection":"column", "gap":"8px" }}>
        <p>Medida do quadrado (mm):</p>
        <input
          type="number"
          value={mmSize}
          onChange={(e) => setmmSize(e.target.value)}
        />
        
        <div class="black-square" style={{width:"100px", height:"100px", backgroundColor:"black", margin:"0 auto"}}></div>

        <button onClick={handleCalculateDPI} style={{"width":"200px"}}>Calcular DPI</button>
        {hasCalculatedDPI && (
          <p>
            DPI Calculado: {dpi.toFixed("1")} DPI (dots per inch)
          </p>
        )}
      </div>
    </div>
  );
};

export default Calibration;
