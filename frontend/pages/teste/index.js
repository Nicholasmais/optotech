import React, { useState } from 'react';

const index = () => {
  const [mmSize, setmmSize] = useState(0);
  const [dpi, setDpi] = useState(0);
  const pxSize = 100;

  const handleCalculateDPI = () => {
    if (mmSize > 0) {
      const calculatedDPI = 25.4 * pxSize / (mmSize);
      setDpi(calculatedDPI);
    }
  };

  return (
    <div>
      <h2>Calibração do Snellen</h2>
      <p>Medida do quadrado (mm):</p>
      <input
        type="number"
        value={mmSize}
        onChange={(e) => setmmSize(e.target.value)}
      />
      
      <div class="black-square" style={{width:"100px", height:"100px", backgroundColor:"black", margin:"0 auto"}}></div>

      <button onClick={handleCalculateDPI}>Calcular DPI</button>
      {dpi > 0 && (
        <p>
          DPI Calculado: {dpi} DPI (dots per inch)
        </p>
      )}
    </div>
  );
};

export default index;
