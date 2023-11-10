import React, { useEffect, useState } from 'react';
import BubbleChart from './BubbleChart';
import styles from '../styles/Estatistics.module.scss'; // Importe os estilos corretos
import PieChart from './PieChart';
import BarChart from './BarChart';
import CheckBox from './CheckBox';
const api = require('../services/api'); 

const Estatistics = ({ setCurrent, visualAcuityComparison, activeUnactive, demographic,mostDate, fetchReport }) => {
  const [startDate, setStartDate] = useState(mostDate.leastRecent);
  const [endDate, setEndDate] = useState(mostDate.mostRecent);
  const [isOldest, setIsOldest] = useState(true);
  const [isNewest, setIsNewest] = useState(true);
  const [isMeusPacientes, setIsMeusPacientes] = useState(true);
  const [isRightEye, setIsRightEye] = useState(true);
  
  // Função para aplicar os filtros aos gráficos
  const applyFilters = () => {
    // Registre os valores dos filtros no estado do componente
    setStartDate(startDate);
    setEndDate(endDate);
    setIsOldest(isOldest);
    setIsNewest(isNewest);
    setIsMeusPacientes(isMeusPacientes);

    // Aplique os filtros aos gráficos aqui
        
    fetchReport({isRight : isRightEye, isAllPatients: isMeusPacientes});
  };

  return (
    <div>
      <div className={styles['button-container']}>
        <button className={styles['pacientes']} onClick={() => { setCurrent("default") }}>
          Voltar
        </button>
      </div>
      <div className={styles['grid-container']}>
        <div className={styles['grid-item']}>
          <div className={styles['filters']}>
            <h3>Filtros</h3>
            <div className={styles['filter-row']}>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <label>
                <input
                  type="checkbox"
                  checked={isOldest}
                  onChange={() => setIsOldest(!isOldest)}
                />
                Mais Antiga
              </label>
            </div>
            <div className={styles['filter-row']}>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <label>
                <input
                  type="checkbox"
                  checked={isNewest}
                  onChange={() => setIsNewest(!isNewest)}
                />
                Mais Recente
              </label>
            </div>
            <div className={styles['filter-row']}>
              <span>Meus pacientes</span>
              <CheckBox
                id="cbx-3"
                checked={isMeusPacientes}
                onChangeFunction={() => setIsMeusPacientes(!isMeusPacientes)}
                notCheckedColor='#007bff'
              />
              <span>Todos pacientes</span>
            </div>
            <div className={styles['filter-row']}>
              <span>Olho esquerdo</span>
              <CheckBox
                id="cbx-4"
                checked={isRightEye}
                onChangeFunction={() => setIsRightEye(!isRightEye)}
                notCheckedColor='#007bff'
              />
              <span>Olho direito</span>
            </div>
            <button onClick={applyFilters}>Aplicar Filtros</button>
          </div>
        </div>
        <div className={styles['grid-item']}>
          <PieChart data = {visualAcuityComparison}/>
        </div>
        <div className={styles['grid-item']}>
          <BubbleChart data = {demographic}/>
        </div>
        <div className={styles['grid-item']}>
          <BarChart data = {activeUnactive} />
        </div>
      </div>      
    </div>
  );
};

export default Estatistics;
