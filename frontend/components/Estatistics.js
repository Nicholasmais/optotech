import React, { useState } from 'react';
import BubbleChart from './BubbleChart';
import styles from '../styles/Estatistics.module.scss'; // Importe os estilos corretos
import PieChart from './PieChart';
import BarChart from './BarChart';
import Filter from './Filter';
import LineChart from './LineChart';

const Estatistics = ({ setCurrent, visualAcuityComparison, activeUnactive, demographic,mostDate, fetchReport, userPatients, patientAppointments }) => {
  const [startDate, setStartDate] = useState(mostDate?.leastRecent || null);
  const [endDate, setEndDate] = useState(mostDate?.mostRecent || null);
  const [isOldest, setIsOldest] = useState(true);
  const [isNewest, setIsNewest] = useState(true);
  const [isMeusPacientes, setIsMeusPacientes] = useState(true);
  const [isRightEye, setIsRightEye] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(''); // Estado para o paciente selecionado
  
  // Função para lidar com a mudança no <select>
  const handlePatientChange = (event) => {
    setSelectedPatient(event.target.value);
  };

  // Função para aplicar os filtros aos gráficos
  const applyFilters = () => {
    // Registre os valores dos filtros no estado do componente
    setStartDate(startDate);
    setEndDate(endDate);
    setIsOldest(isOldest);
    setIsNewest(isNewest);
    setIsMeusPacientes(isMeusPacientes);

    // Aplique os filtros aos gráficos aqui
    fetchReport({isRight : isRightEye, isAllPatients: isMeusPacientes, initialDate:startDate, finalDate:endDate, patient:selectedPatient});
  };

  return (
    <div>
      <div className={styles['button-container']}>
        <button className={styles['pacientes']} onClick={() => { setCurrent("default") }}>
          Voltar
        </button>
        <Filter 
            applyFilters={applyFilters}
            endDate={endDate}
            startDate={startDate}
            isMeusPacientes={isMeusPacientes}
            isNewest={isNewest}
            isOldest={isOldest}
            isRightEye={isRightEye}
            setEndDate={setEndDate}
            setIsMeusPacientes={setIsMeusPacientes}
            setIsNewest={setIsNewest}
            setIsOldest={setIsOldest}
            setIsRightEye={setIsRightEye}
            setStartDate={setStartDate}
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
            handlePatientChange={handlePatientChange}
            userPatients={userPatients || []} 
            >            
          </Filter>
      </div>
      <div className={styles['grid-container']}>
        <div className={styles['grid-item']}>              
          <LineChart data={patientAppointments} />
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
