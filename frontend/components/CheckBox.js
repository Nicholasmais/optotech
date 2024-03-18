import React, { useState } from 'react';

const CheckBox = ({ id, checked, onChangeFunction, notCheckedColor="#9A9999", CheckedColor  ="#28a745"}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleInputChange = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onChangeFunction(newCheckedState);
  };

  const checkboxStyle = {
    display: 'none', // Oculta a caixa de seleção padrão
  };

  const labelStyle = {
    display: 'block',
    position: 'relative',
    width: '40px',
    height: '20px',
    cursor: 'pointer',
  };

  const toggleStyle = {
    position: 'absolute',
    top: '3px',
    left: '3px',
    width: '34px',
    height: '14px',
    display: 'block',
    background: isChecked ? CheckedColor: notCheckedColor,
    borderRadius: '8px',
    transition: 'background 0.2s ease',
  };

  const spanStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '20px',
    height: '20px',
    display: 'block',
    background: 'white',
    borderRadius: '10px',    
    boxShadow: '0 3px 8px rgba(154, 153, 153, 0.5)',
    transform: isChecked ? 'translateX(20px)' : 'translateX(0)',
    transition: 'all 0.2s ease',
    zIndex:1,
    border: `1px solid ${isChecked ? CheckedColor: notCheckedColor}`
  };

  const beforeStyle = {
    content: '""',
    position: 'absolute',
    display: 'block',
    margin: '-18px',
    width: '56px',
    height: '56px',
    background: 'rgba(79, 46, 220, 0.5)',
    borderRadius: '50%',
    transform: isChecked ? 'scale(1)' : 'scale(0)',
    opacity: isChecked ? '0' : '1',
    pointerEvents: 'none',
  };

  const checkboxWrapperStyle = {
    display: 'flex',
    alignItems: 'center', // Centraliza verticalmente
  };  

  return (
    <div style={checkboxWrapperStyle}>
      <input
        type="checkbox"
        id={id}
        style={checkboxStyle}
        checked={isChecked}
        onChange={handleInputChange}
      />
      <label htmlFor={id} style={labelStyle}>
        <span style={spanStyle}>
          <div style={beforeStyle}></div>
        </span>
        <div style={toggleStyle}></div>
      </label>
    </div>
  );
};

export default CheckBox;
