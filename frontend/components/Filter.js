import CheckBox from './CheckBox';
import styles from '../styles/Filter.module.scss';
import FilterIcon  from '../assets/filter.png';
import React, { useState } from 'react';

const Filter = ({ startDate, setStartDate, isOldest, setIsOldest, endDate, setEndDate, isNewest, setIsNewest, isMeusPacientes, setIsMeusPacientes, isRightEye, setIsRightEye, applyFilters, userPatients, handlePatientChange, selectedPatient, setSelectedPatient }) => {
  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className={styles["filters"]} style={{backgroundColor: showFilters ? "#f5f5f5" : ""}}>
      <button onClick={toggleFilters} style={{"width":"5rem", float:"right"}}>
        <img src={FilterIcon.src} alt="Filtro" /> Filtros
      </button>
      {showFilters && (
        <>
        <br></br>
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
          <div className={styles['filter-row']}> 
            <div className={styles["select-container"]}>
            <select onChange={handlePatientChange} value={selectedPatient}>
              <option value="">Selecione um Paciente</option>
              {userPatients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.nome} {/* Exibe o nome do paciente */}
                </option>
              ))}
            </select>
            </div>
          </div>
          <button onClick={applyFilters}>Aplicar Filtros</button>
        </>
      )} 
    </div>
  );
}

export default Filter;
