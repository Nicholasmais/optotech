import React, { useEffect, useState } from 'react';
import BubbleChart from './BubbleChart';
import styles from '../styles/Estatistics.module.scss'; // Importe os estilos corretos
import PieChart from './PieChart';
import BarChart from './BarChart';
import CheckBox from './CheckBox';
const api = require('../services/api'); 

const Estatistics = ({ setCurrent, visualAcuityComparison }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isOldest, setIsOldest] = useState(false);
  const [isNewest, setIsNewest] = useState(false);
  const [isMeusAlunos, setIsMeusAlunos] = useState(true);
  const [isRightEye, setIsRightEye] = useState(false);

  const activeUnactive = {
    "patient": {
      "active": 40,
      "unActive" : 20
    },
    "appointment": {
      "active": 30,
      "unActive" : 10
    }  
  };

  const acuityAgeDemographic = [
    // Pacientes com 20/200 de visão
    { x: "20/200", y: 70, r: 3 },
    { x: "20/200", y: 50, r: 2 },
    { x: "20/200", y: 30, r: 1 },
  
    // Pacientes com 20/100 de visão
    { x: "20/100", y: 65, r: 5 },
    { x: "20/100", y: 45, r: 3 },
    { x: "20/100", y: 20, r: 2 },
  
    // Pacientes com 20/70 de visão
    { x: "20/70", y: 55, r: 8 },
    { x: "20/70", y: 35, r: 6 },
    { x: "20/70", y: 15, r: 1 },
  
    // Pacientes com 20/50 de visão
    { x: "20/50", y: 40, r: 7 },
    { x: "20/50", y: 25, r: 5 },
    { x: "20/50", y: 10, r: 2 },
  
    // Pacientes com 20/40 de visão
    { x: "20/40", y: 30, r: 10 },
    { x: "20/40", y: 22, r: 9 },
    { x: "20/40", y: 18, r: 4 },
  
    // Pacientes com 20/30 de visão
    { x: "20/30", y: 20, r: 12 },
    { x: "20/30", y: 10, r: 15 },
  
    // Pacientes com 20/25 de visão
    { x: "20/25", y: 30, r: 20 },
    { x: "20/25", y: 25, r: 18 },
    { x: "20/25", y: 22, r: 5 },
  
    // Pacientes com 20/20 de visão
    { x: "20/20", y: 25, r: 25 },
    { x: "20/20", y: 35, r: 30 },
    { x: "20/20", y: 18, r: 40 },
    { x: "20/20", y: 10, r: 50 },
  
    // Pacientes com 20/15 de visão
    { x: "20/15", y: 30, r: 5 },
    { x: "20/15", y: 22, r: 2 },
    { x: "20/15", y: 15, r: 1 },
  
    // Pacientes com 20/13 de visão
    { x: "20/13", y: 27, r: 2 },
    { x: "20/13", y: 19, r: 1 },
  
    // Pacientes com 20/10 de visão
    { x: "20/10", y: 25, r: 1 },
    { x: "20/10", y: 18, r: 1 },
  ];

  // Função para aplicar os filtros aos gráficos
  const applyFilters = () => {
    // Registre os valores dos filtros no estado do componente
    setStartDate(startDate);
    setEndDate(endDate);
    setIsOldest(isOldest);
    setIsNewest(isNewest);
    setIsMeusAlunos(isMeusAlunos);

    // Aplique os filtros aos gráficos aqui
  };

  return (
    <div>
      <div className={styles['button-container']}>
        <button className={styles['alunos']} onClick={() => { setCurrent("default") }}>
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
                  checked={!isNewest}
                  onChange={() => setIsNewest(!isNewest)}
                />
                Mais Recente
              </label>
            </div>
            <div className={styles['filter-row']}>
              <span>Meus pacientes</span>
              <CheckBox
                id="cbx-3"
                checked={isMeusAlunos}
                onChangeFunction={() => setIsMeusAlunos(!isMeusAlunos)}
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
          <BubbleChart data = {acuityAgeDemographic}/>
        </div>
        <div className={styles['grid-item']}>
          <BarChart data = {activeUnactive} />
        </div>
      </div>
    </div>
  );
};

export default Estatistics;
