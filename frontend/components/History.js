import React from 'react'
import styles from '../styles/MeusDados.module.scss'; // Importe os estilos corretos

const History = ({appointmentHistory, setCurrent}) => {
  return (
    <>
      <div className={styles['historico']}>
        <button className={styles['pacientes']} onClick={() => {setCurrent("default")}}>Voltar</button>

        <h2 className={styles.header}>Histórico de Atendimento</h2>
        
        <div className={styles['table-div']}>
          <table className={styles['appointment-table']}>
            <thead>
              <tr>
                <th style={{width: "20%"}}>Código</th>
                <th style={{width: "30%"}}>Paciente</th>
                <th style={{width: "30%"}}>Data do atendimento</th>
                <th style={{width: "20%"}}>Acuidade</th>
              </tr>
            </thead>
            <tbody>
              {appointmentHistory.map((appointment, index) => (
                <tr key={index} style={{"backgroundColor":appointment.paciente.ativo ? "none" : "rgba(255,0,0,0.1)"}}>
                  <td>{appointment.paciente.codigo}</td>
                  <td>{appointment.paciente.nome}</td>
                  <td>{appointment.data_atendimento}</td>
                    <td>
                      Olho esquerdo {appointment.acuidade.slice(0,appointment.acuidade.indexOf("."))}
                      <br></br>
                      Olho direito {appointment.acuidade.slice(appointment.acuidade.indexOf(".")+1)}
                    </td>                    
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default History