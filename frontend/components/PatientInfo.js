import React from 'react';
import styles from '../styles/PatientInfo.module.scss';

const PatientInfo = ({ patientInfo }) => {
  return (
    <div className={styles?.patientInfo}>
      <h2>Informações do Paciente</h2>
      <div className={styles?.infoItem}>
        <strong>Nome:</strong> {patientInfo.nome}
      </div>
      <div className={styles?.infoItem}>
        <strong>Idade:</strong> {patientInfo.idade}
      </div>
      <div className={styles?.infoItem}>
        <strong>Código:</strong> {patientInfo.codigo}
      </div>
    </div>
  );
};

export default PatientInfo;
